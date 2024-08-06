# Backend Task

## Запуск проекта

Этот проект представляет собой простой веб-сервер, построенный с использованием Fastify и TypeScript, который взаимодействует с базой данных PostgreSQL. Он включает в себя два эндпоинта: один для получения предметов из API Skinport с кешированием, а другой для управления балансом пользователя.

## Требования

- Node.js
- PostgreSQL

## Настройка

npm install

## Настройка базы данных PostgreSQL
CREATE DATABASE your_database_name;

\c your_database_name

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    balance DECIMAL NOT NULL
);

INSERT INTO users (balance) VALUES (1000.00);

## Настройка переменных окружения
Создайте файл .env в корневой директории вашего проекта со следующим содержимым:
DATABASE_URL=postgres://username:password@localhost:5432/your_database_name

Замените username, password и your_database_name на ваши актуальные данные для подключения к PostgreSQL.

## Запуск сервера
npm run dev