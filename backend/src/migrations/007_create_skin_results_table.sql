CREATE TABLE skin_results (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    image_url TEXT,

    prediction VARCHAR(100),

    confidence DECIMAL(5,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_skin_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);