# Backend Task

## Запуск проекта

Этот проект представляет собой простой веб-сервер, построенный с использованием Fastify и TypeScript, который взаимодействует с базой данных PostgreSQL. Он включает в себя два эндпоинта: один для получения предметов из API Skinport с кешированием, а другой для управления балансом пользователя.

## Требования

- Node.js
- PostgreSQL

## Настройка
```bash
npm install
```

## Настройка базы данных PostgreSQL
```bash
CREATE DATABASE your_database_name;

\c your_database_name

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    balance DECIMAL NOT NULL
);

INSERT INTO users (balance) VALUES (1000.00);
```
## Настройка переменных окружения
Создайте файл .env в корневой директории вашего проекта со следующим содержимым:
```bash
DATABASE_URL=postgres://username:password@localhost:5432/your_database_name
```

Замените username, password и your_database_name на ваши актуальные данные для подключения к PostgreSQL.

## Запуск сервера
npm run dev

## Эндпоинты
**GET /items**

Получает предметы из API Skinport и возвращает список с дополнительными полями для минимальных цен на торгуемые и неторгуемые предметы. Ответ кешируется на 10 минут.

Параметры запроса:

**app_id** (опционально): ID приложения для предметов (по умолчанию: 730 для CS
).
**currency** (опционально): Валюта для цен (по умолчанию: USD).


**POST /purchase**

Обрабатывает списание баланса пользователя при покупке предмета.

Тело запроса:

**userId** (number): ID пользователя, совершающего покупку.
**amount** (number): Сумма, которая будет списана с баланса пользователя.
