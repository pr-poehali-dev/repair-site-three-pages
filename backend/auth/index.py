import json
import os
import hashlib
import secrets
import psycopg2


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


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def esc(v: str) -> str:
    return v.replace("'", "''")


def get_user_by_token(cur, token: str):
    if not token:
        return None
    cur.execute(
        f"SELECT u.id, u.email, u.full_name, u.phone, u.role FROM sessions s "
        f"JOIN users u ON u.id = s.user_id WHERE s.token = '{esc(token)}'"
    )
    row = cur.fetchone()
    if not row:
        return None
    return {'id': row[0], 'email': row[1], 'full_name': row[2], 'phone': row[3], 'role': row[4]}


def is_manager(login: str, password: str) -> bool:
    pairs = [
        (os.environ.get('MANAGER_1_LOGIN', ''), os.environ.get('MANAGER_1_PASSWORD', '')),
        (os.environ.get('MANAGER_2_LOGIN', ''), os.environ.get('MANAGER_2_PASSWORD', '')),
        (os.environ.get('MANAGER_3_LOGIN', ''), os.environ.get('MANAGER_3_PASSWORD', '')),
    ]
    for l, p in pairs:
        if l and p and login == l and password == p:
            return True
    return False


def handler(event: dict, context) -> dict:
    '''Авторизация и регистрация пользователей: вход, регистрация заказчиков, регистрация прорабов управленцем, проверка сессии.'''
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
        if method == 'GET' and action == 'me':
            user = get_user_by_token(cur, token)
            if not user:
                return resp(401, {'error': 'Не авторизован'})
            return resp(200, {'user': user})

        body = json.loads(event.get('body') or '{}')

        if method == 'POST' and action == 'register':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            full_name = body.get('full_name', '').strip()
            phone = body.get('phone', '').strip()
            if not email or not password:
                return resp(400, {'error': 'Укажите email и пароль'})
            cur.execute(f"SELECT id FROM users WHERE email = '{esc(email)}'")
            if cur.fetchone():
                return resp(409, {'error': 'Пользователь с таким email уже существует'})
            cur.execute(
                f"INSERT INTO users (email, password_hash, full_name, phone, role) "
                f"VALUES ('{esc(email)}', '{hash_password(password)}', '{esc(full_name)}', '{esc(phone)}', 'client') RETURNING id"
            )
            uid = cur.fetchone()[0]
            new_token = secrets.token_hex(32)
            cur.execute(f"INSERT INTO sessions (token, user_id) VALUES ('{new_token}', {uid})")
            conn.commit()
            return resp(200, {'token': new_token, 'user': {'id': uid, 'email': email, 'full_name': full_name, 'phone': phone, 'role': 'client'}})

        if method == 'POST' and action == 'login':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            cur.execute(
                f"SELECT id, email, full_name, phone, role FROM users "
                f"WHERE email = '{esc(email)}' AND password_hash = '{hash_password(password)}'"
            )
            row = cur.fetchone()
            if not row:
                return resp(401, {'error': 'Неверный email или пароль'})
            new_token = secrets.token_hex(32)
            cur.execute(f"INSERT INTO sessions (token, user_id) VALUES ('{new_token}', {row[0]})")
            conn.commit()
            return resp(200, {'token': new_token, 'user': {'id': row[0], 'email': row[1], 'full_name': row[2], 'phone': row[3], 'role': row[4]}})

        if method == 'POST' and action == 'admin_login':
            login_val = body.get('login', '')
            password = body.get('password', '')
            if is_manager(login_val, password):
                return resp(200, {'success': True})
            return resp(401, {'error': 'Неверный логин или пароль управленца'})

        if method == 'POST' and action == 'register_foreman':
            admin_login = body.get('admin_login', '')
            admin_password = body.get('admin_password', '')
            if not is_manager(admin_login, admin_password):
                return resp(401, {'error': 'Доступ только для управленца'})
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            full_name = body.get('full_name', '').strip()
            phone = body.get('phone', '').strip()
            if not email or not password:
                return resp(400, {'error': 'Укажите email и пароль'})
            cur.execute(f"SELECT id FROM users WHERE email = '{esc(email)}'")
            if cur.fetchone():
                return resp(409, {'error': 'Пользователь с таким email уже существует'})
            cur.execute(
                f"INSERT INTO users (email, password_hash, full_name, phone, role) "
                f"VALUES ('{esc(email)}', '{hash_password(password)}', '{esc(full_name)}', '{esc(phone)}', 'foreman') RETURNING id"
            )
            uid = cur.fetchone()[0]
            conn.commit()
            return resp(200, {'id': uid, 'email': email, 'full_name': full_name, 'role': 'foreman'})

        if method == 'GET' and action == 'foremen':
            admin_login = params.get('admin_login', '')
            admin_password = params.get('admin_password', '')
            if not is_manager(admin_login, admin_password):
                return resp(401, {'error': 'Доступ только для управленца'})
            cur.execute("SELECT id, email, full_name, phone, created_at FROM users WHERE role = 'foreman' ORDER BY created_at DESC")
            rows = cur.fetchall()
            return resp(200, {'foremen': [
                {'id': r[0], 'email': r[1], 'full_name': r[2], 'phone': r[3], 'created_at': r[4].isoformat()} for r in rows
            ]})

        if method == 'POST' and action == 'logout':
            cur.execute(f"DELETE FROM sessions WHERE token = '{esc(token)}'")
            conn.commit()
            return resp(200, {'success': True})

        return resp(400, {'error': 'Неизвестное действие'})
    finally:
        cur.close()
        conn.close()