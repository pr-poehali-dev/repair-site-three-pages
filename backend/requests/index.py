import json
import os
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-Manager-Password',
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
        f"SELECT u.id, u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = '{esc(token)}'"
    )
    row = cur.fetchone()
    return {'id': row[0], 'role': row[1]} if row else None


def is_manager(password: str) -> bool:
    p1 = os.environ.get('ADMIN_PASSWORD', '')
    p2 = os.environ.get('ADMIN_PASSWORD_2', '')
    return bool(password and (password == p1 or password == p2))


def handler(event: dict, context) -> dict:
    '''Приём заявок с формы обратной связи и просмотр их прорабами в личном кабинете.'''
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
        if method == 'POST' and action == 'create':
            body = json.loads(event.get('body') or '{}')
            name = esc(body.get('name', '').strip())
            phone = esc(body.get('phone', '').strip())
            email = esc(body.get('email', '').strip())
            message = esc(body.get('message', '').strip())
            if not name or (not phone and not email):
                return resp(400, {'error': 'Укажите имя и телефон или email'})
            cur.execute(
                f"INSERT INTO requests (name, phone, email, message) "
                f"VALUES ('{name}', '{phone}', '{email}', '{message}') RETURNING id"
            )
            rid = cur.fetchone()[0]
            conn.commit()
            return resp(200, {'id': rid, 'success': True})

        mgr_pwd = headers.get('X-Manager-Password') or headers.get('x-manager-password') or ''
        is_mgr = is_manager(mgr_pwd)
        user = get_user(cur, token)
        if not is_mgr and (not user or user['role'] != 'foreman'):
            return resp(401, {'error': 'Доступ только для прораба или управленца'})

        if method == 'GET' and action == 'list':
            cur.execute(
                "SELECT r.id, r.name, r.phone, r.email, r.message, r.status, r.created_at, u.full_name "
                "FROM requests r LEFT JOIN users u ON u.id = r.taken_by ORDER BY r.created_at DESC"
            )
            items = [
                {'id': r[0], 'name': r[1], 'phone': r[2], 'email': r[3], 'message': r[4],
                 'status': r[5], 'created_at': r[6].isoformat(), 'taken_by': r[7]} for r in cur.fetchall()
            ]
            return resp(200, {'requests': items})

        if method == 'POST' and action == 'take':
            body = json.loads(event.get('body') or '{}')
            rid = int(body.get('id', 0))
            cur.execute(f"UPDATE requests SET status='in_work', taken_by={user['id']} WHERE id={rid}")
            conn.commit()
            return resp(200, {'success': True})

        if method == 'POST' and action == 'close':
            body = json.loads(event.get('body') or '{}')
            rid = int(body.get('id', 0))
            cur.execute(f"UPDATE requests SET status='closed' WHERE id={rid}")
            conn.commit()
            return resp(200, {'success': True})

        return resp(400, {'error': 'Неизвестное действие'})
    finally:
        cur.close()
        conn.close()