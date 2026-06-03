CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    token TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    expires_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_refresh_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);