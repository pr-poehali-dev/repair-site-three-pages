CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chat_type VARCHAR(20) NOT NULL DEFAULT 'object',
    object_id INTEGER REFERENCES objects(id),
    sender_id INTEGER REFERENCES users(id),
    sender_name VARCHAR(255) NOT NULL DEFAULT '',
    sender_role VARCHAR(20) NOT NULL DEFAULT 'client',
    text TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_object ON messages(object_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_type ON messages(chat_type);