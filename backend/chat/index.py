import json
import os
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-Manager-Login, X-Manager-Password',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def resp(status, body):
    return {'statusCode': status, 'headers': cors_headers(), 'body': json.dumps(body, ensure_ascii=False)}


def esc(v: str) -> str:
    return v.replace("'", "''")


def get_user(cur, token: str):
    if not token:
        return None
    cur.execute(
        f"SELECT u.id, u.full_name, u.role FROM sessions s "
        f"JOIN users u ON u.id = s.user_id WHERE s.token = '{esc(token)}'"
    )
    row = cur.fetchone()
    return {'id': row[0], 'full_name': row[1] or '', 'role': row[2]} if row else None


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


def row_to_msg(r):
    return {
        'id': r[0],
        'sender_id': r[1],
        'sender_name': r[2],
        'sender_role': r[3],
        'text': r[4],
        'created_at': r[5].isoformat(),
    }


def handler(event: dict, context) -> dict:
    '''Чат между прорабом и заказчиком по объекту, а также общий командный чат прорабов и управленцев.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}

    headers = event.get('headers', {})
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''
    mgr_login = headers.get('X-Manager-Login') or headers.get('x-manager-login') or ''
    mgr_pwd = headers.get('X-Manager-Password') or headers.get('x-manager-password') or ''
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    conn = get_conn()
    cur = conn.cursor()
    try:
        is_mgr = is_manager(mgr_login, mgr_pwd)
        user = get_user(cur, token)

        if not is_mgr and not user:
            return resp(401, {'error': 'Не авторизован'})

        # ─── ОБЪЕКТНЫЙ ЧАТ (прораб ↔ заказчик) ───────────────────────
        if action == 'object_messages':
            object_id = int(params.get('object_id', 0))
            if not object_id:
                return resp(400, {'error': 'Укажите object_id'})

            # Проверка доступа: прораб/заказчик только к своим объектам
            if user:
                if user['role'] == 'foreman':
                    cur.execute(f"SELECT id FROM objects WHERE id={object_id} AND foreman_id={user['id']}")
                elif user['role'] == 'client':
                    cur.execute(f"SELECT id FROM objects WHERE id={object_id} AND client_id={user['id']}")
                else:
                    cur.execute(f"SELECT id FROM objects WHERE id={object_id}")
                if not cur.fetchone():
                    return resp(403, {'error': 'Нет доступа к этому объекту'})

            if method == 'GET':
                cur.execute(
                    f"SELECT id, sender_id, sender_name, sender_role, text, created_at "
                    f"FROM messages WHERE chat_type='object' AND object_id={object_id} "
                    f"ORDER BY created_at ASC LIMIT 200"
                )
                return resp(200, {'messages': [row_to_msg(r) for r in cur.fetchall()]})

            if method == 'POST':
                body = json.loads(event.get('body') or '{}')
                text = body.get('text', '').strip()
                if not text:
                    return resp(400, {'error': 'Сообщение пустое'})

                if user:
                    sid = user['id']
                    sname = esc(user['full_name'] or user['role'])
                    srole = user['role']
                else:
                    return resp(401, {'error': 'Не авторизован'})

                cur.execute(
                    f"INSERT INTO messages (chat_type, object_id, sender_id, sender_name, sender_role, text) "
                    f"VALUES ('object', {object_id}, {sid}, '{sname}', '{srole}', '{esc(text)}') "
                    f"RETURNING id, created_at"
                )
                row = cur.fetchone()
                conn.commit()
                return resp(200, {
                    'id': row[0], 'sender_id': sid, 'sender_name': sname,
                    'sender_role': srole, 'text': text, 'created_at': row[1].isoformat()
                })

        # ─── КОМАНДНЫЙ ЧАТ (прорабы + управленцы) ────────────────────
        if action == 'team_messages':
            # Только прорабы и управленцы
            if user and user['role'] == 'client':
                return resp(403, {'error': 'Командный чат недоступен заказчикам'})

            if method == 'GET':
                cur.execute(
                    "SELECT id, sender_id, sender_name, sender_role, text, created_at "
                    "FROM messages WHERE chat_type='team' "
                    "ORDER BY created_at ASC LIMIT 300"
                )
                return resp(200, {'messages': [row_to_msg(r) for r in cur.fetchall()]})

            if method == 'POST':
                body = json.loads(event.get('body') or '{}')
                text = body.get('text', '').strip()
                if not text:
                    return resp(400, {'error': 'Сообщение пустое'})

                if is_mgr:
                    sid = 0
                    sname = esc(mgr_login)
                    srole = 'manager'
                elif user:
                    sid = user['id']
                    sname = esc(user['full_name'] or 'Прораб')
                    srole = user['role']
                else:
                    return resp(401, {'error': 'Не авторизован'})

                cur.execute(
                    f"INSERT INTO messages (chat_type, object_id, sender_id, sender_name, sender_role, text) "
                    f"VALUES ('team', NULL, {sid}, '{sname}', '{srole}', '{esc(text)}') "
                    f"RETURNING id, created_at"
                )
                row = cur.fetchone()
                conn.commit()
                return resp(200, {
                    'id': row[0], 'sender_id': sid, 'sender_name': sname,
                    'sender_role': srole, 'text': text, 'created_at': row[1].isoformat()
                })

        return resp(400, {'error': 'Неизвестное действие'})
    finally:
        cur.close()
        conn.close()
