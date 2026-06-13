CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL DEFAULT '',
    phone VARCHAR(50) NOT NULL DEFAULT '',
    role VARCHAR(20) NOT NULL DEFAULT 'client',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    token VARCHAR(64) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS objects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    address TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    status VARCHAR(30) NOT NULL DEFAULT 'in_progress',
    start_date DATE,
    end_date DATE,
    foreman_id INTEGER REFERENCES users(id),
    client_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS object_documents (
    id SERIAL PRIMARY KEY,
    object_id INTEGER NOT NULL REFERENCES objects(id),
    doc_type VARCHAR(20) NOT NULL DEFAULT 'document',
    title VARCHAR(255) NOT NULL DEFAULT '',
    comment TEXT NOT NULL DEFAULT '',
    file_url TEXT NOT NULL DEFAULT '',
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT '',
    phone VARCHAR(50) NOT NULL DEFAULT '',
    email VARCHAR(255) NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    taken_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_objects_foreman ON objects(foreman_id);
CREATE INDEX IF NOT EXISTS idx_objects_client ON objects(client_id);
CREATE INDEX IF NOT EXISTS idx_docs_object ON object_documents(object_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);