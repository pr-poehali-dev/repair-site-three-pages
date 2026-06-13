import json
import os
import base64
import uuid
import psycopg2
import boto3


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def resp(status, body):
    return {'statusCode': status, 'headers': cors_headers(), 'body': json.dumps(body)}


def esc(v: str) -> str:
    return v.replace("'", "''")


def get_user(cur, token: str):
    if not token:
        return None
    cur.execute(
        f"SELECT u.id, u.email, u.full_name, u.role FROM sessions s "
        f"JOIN users u ON u.id = s.user_id WHERE s.token = '{esc(token)}'"
    )
    row = cur.fetchone()
    if not row:
        return None
    return {'id': row[0], 'email': row[1], 'full_name': row[2], 'role': row[3]}


def upload_file(file_base64: str, filename: str) -> str:
    raw = file_base64
    content_type = 'application/octet-stream'
    if ',' in raw and raw.strip().startswith('data:'):
        header, raw = raw.split(',', 1)
        if ':' in header and ';' in header:
            content_type = header.split(':', 1)[1].split(';', 1)[0]
    data = base64.b64decode(raw)
    ext = ''
    if '.' in filename:
        ext = '.' + filename.rsplit('.', 1)[1][:8]
    key = f"objects/{uuid.uuid4().hex}{ext}"
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=data, ContentType=content_type)
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def object_to_dict(r):
    return {
        'id': r[0], 'title': r[1], 'address': r[2], 'description': r[3], 'status': r[4],
        'start_date': r[5].isoformat() if r[5] else None,
        'end_date': r[6].isoformat() if r[6] else None,
        'foreman_id': r[7], 'client_id': r[8],
        'foreman_name': r[9], 'client_name': r[10], 'client_email': r[11],
    }


SELECT_OBJ = (
    "SELECT o.id, o.title, o.address, o.description, o.status, o.start_date, o.end_date, "
    "o.foreman_id, o.client_id, f.full_name, c.full_name, c.email "
    "FROM objects o LEFT JOIN users f ON f.id = o.foreman_id LEFT JOIN users c ON c.id = o.client_id"
)


def handler(event: dict, context) -> dict:
    '''Управление строительными объектами, документами и фотоотчётами для прораба и заказчика.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}

    headers = event.get('headers', {})
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    conn = get_conn()
    cur = conn.cursor()
    try:
        user = get_user(cur, token)
        if not user:
            return resp(401, {'error': 'Не авторизован'})

        if method == 'GET' and action == 'list':
            if user['role'] == 'foreman':
                cur.execute(SELECT_OBJ + f" WHERE o.foreman_id = {user['id']} ORDER BY o.created_at DESC")
            elif user['role'] == 'client':
                cur.execute(SELECT_OBJ + f" WHERE o.client_id = {user['id']} ORDER BY o.created_at DESC")
            else:
                cur.execute(SELECT_OBJ + " ORDER BY o.created_at DESC")
            return resp(200, {'objects': [object_to_dict(r) for r in cur.fetchall()]})

        if method == 'GET' and action == 'documents':
            object_id = int(params.get('object_id', 0))
            cur.execute(
                f"SELECT d.id, d.doc_type, d.title, d.comment, d.file_url, d.created_at, u.full_name "
                f"FROM object_documents d LEFT JOIN users u ON u.id = d.uploaded_by "
                f"WHERE d.object_id = {object_id} ORDER BY d.created_at DESC"
            )
            docs = [
                {'id': r[0], 'doc_type': r[1], 'title': r[2], 'comment': r[3], 'file_url': r[4],
                 'created_at': r[5].isoformat(), 'uploaded_by': r[6]} for r in cur.fetchall()
            ]
            return resp(200, {'documents': docs})

        if method == 'GET' and action == 'clients':
            cur.execute("SELECT id, full_name, email, phone FROM users WHERE role = 'client' ORDER BY full_name")
            return resp(200, {'clients': [
                {'id': r[0], 'full_name': r[1], 'email': r[2], 'phone': r[3]} for r in cur.fetchall()
            ]})

        body = json.loads(event.get('body') or '{}')

        if method == 'POST' and action == 'create_object':
            if user['role'] != 'foreman':
                return resp(403, {'error': 'Только прораб может создавать объекты'})
            title = body.get('title', '').strip()
            if not title:
                return resp(400, {'error': 'Укажите название объекта'})
            address = body.get('address', '').strip()
            description = body.get('description', '').strip()
            status = body.get('status', 'in_progress')
            start_date = body.get('start_date') or None
            end_date = body.get('end_date') or None
            client_id = body.get('client_id') or None
            sd = f"'{esc(start_date)}'" if start_date else 'NULL'
            ed = f"'{esc(end_date)}'" if end_date else 'NULL'
            cid = str(int(client_id)) if client_id else 'NULL'
            cur.execute(
                f"INSERT INTO objects (title, address, description, status, start_date, end_date, foreman_id, client_id) "
                f"VALUES ('{esc(title)}', '{esc(address)}', '{esc(description)}', '{esc(status)}', {sd}, {ed}, {user['id']}, {cid}) RETURNING id"
            )
            oid = cur.fetchone()[0]
            conn.commit()
            return resp(200, {'id': oid})

        if method == 'POST' and action == 'update_object':
            if user['role'] != 'foreman':
                return resp(403, {'error': 'Только прораб может редактировать объекты'})
            object_id = int(body.get('id', 0))
            title = esc(body.get('title', '').strip())
            address = esc(body.get('address', '').strip())
            description = esc(body.get('description', '').strip())
            status = esc(body.get('status', 'in_progress'))
            start_date = body.get('start_date') or None
            end_date = body.get('end_date') or None
            client_id = body.get('client_id') or None
            sd = f"'{esc(start_date)}'" if start_date else 'NULL'
            ed = f"'{esc(end_date)}'" if end_date else 'NULL'
            cid = str(int(client_id)) if client_id else 'NULL'
            cur.execute(
                f"UPDATE objects SET title='{title}', address='{address}', description='{description}', "
                f"status='{status}', start_date={sd}, end_date={ed}, client_id={cid} "
                f"WHERE id={object_id} AND foreman_id={user['id']}"
            )
            conn.commit()
            return resp(200, {'success': True})

        if method == 'POST' and action == 'add_document':
            if user['role'] != 'foreman':
                return resp(403, {'error': 'Только прораб может загружать документы'})
            object_id = int(body.get('object_id', 0))
            doc_type = esc(body.get('doc_type', 'document'))
            title = esc(body.get('title', '').strip())
            comment = esc(body.get('comment', '').strip())
            file_base64 = body.get('file', '')
            filename = body.get('filename', 'file')
            file_url = upload_file(file_base64, filename) if file_base64 else ''
            cur.execute(
                f"INSERT INTO object_documents (object_id, doc_type, title, comment, file_url, uploaded_by) "
                f"VALUES ({object_id}, '{doc_type}', '{title}', '{comment}', '{esc(file_url)}', {user['id']}) RETURNING id"
            )
            did = cur.fetchone()[0]
            conn.commit()
            return resp(200, {'id': did, 'file_url': file_url})

        return resp(400, {'error': 'Неизвестное действие'})
    finally:
        cur.close()
        conn.close()
