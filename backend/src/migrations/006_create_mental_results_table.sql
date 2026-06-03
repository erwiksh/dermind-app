CREATE TABLE mental_results (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    input_text TEXT NOT NULL,

    prediction VARCHAR(100),

    score DECIMAL(5,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mental_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);