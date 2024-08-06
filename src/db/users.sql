CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    balance DECIMAL NOT NULL
);

INSERT INTO users (balance) VALUES (1000.00);