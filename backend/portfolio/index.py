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
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def check_admin(event):
    password = event.get('headers', {}).get('X-Admin-Password') or event.get('headers', {}).get('x-admin-password')
    return password and password == os.environ.get('ADMIN_PASSWORD')


def upload_image(image_base64: str) -> str:
    raw = image_base64
    content_type = 'image/jpeg'
    if ',' in raw and raw.strip().startswith('data:'):
        header, raw = raw.split(',', 1)
        if 'image/png' in header:
            content_type = 'image/png'
        elif 'image/webp' in header:
            content_type = 'image/webp'
    data = base64.b64decode(raw)
    ext = 'png' if content_type == 'image/png' else ('webp' if content_type == 'image/webp' else 'jpg')
    key = f"portfolio/{uuid.uuid4().hex}.{ext}"
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=data, ContentType=content_type)
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def handler(event: dict, context) -> dict:
    '''Управление портфолио: список работ для всех, добавление и удаление для администратора, проверка входа.'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, title, description, image_url, created_at FROM portfolio ORDER BY created_at DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        items = [
            {'id': r[0], 'title': r[1], 'description': r[2], 'image_url': r[3], 'created_at': r[4].isoformat()}
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'items': items})}

    body = json.loads(event.get('body') or '{}')

    if method == 'POST' and action == 'login':
        password = body.get('password', '')
        if password == os.environ.get('ADMIN_PASSWORD'):
            return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'success': True})}
        return {'statusCode': 401, 'headers': cors_headers(), 'body': json.dumps({'success': False, 'error': 'Неверный логин или пароль'})}

    if not check_admin(event):
        return {'statusCode': 401, 'headers': cors_headers(), 'body': json.dumps({'error': 'Доступ запрещён'})}

    if method == 'POST':
        title = body.get('title', '').strip()
        description = body.get('description', '').strip()
        image_base64 = body.get('image', '')
        if not title:
            return {'statusCode': 400, 'headers': cors_headers(), 'body': json.dumps({'error': 'Укажите название'})}
        image_url = upload_image(image_base64) if image_base64 else ''
        title_esc = title.replace("'", "''")
        desc_esc = description.replace("'", "''")
        url_esc = image_url.replace("'", "''")
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO portfolio (title, description, image_url) VALUES ('{title_esc}', '{desc_esc}', '{url_esc}') RETURNING id, created_at"
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({
            'id': row[0], 'title': title, 'description': description, 'image_url': image_url, 'created_at': row[1].isoformat()
        })}

    if method == 'DELETE':
        item_id = int(body.get('id', 0))
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM portfolio WHERE id = {item_id}")
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'success': True})}

    return {'statusCode': 405, 'headers': cors_headers(), 'body': json.dumps({'error': 'Method not allowed'})}
