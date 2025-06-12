# Inner Flame

Inner Flame is a full-stack web application designed to help users explore and overcome personal challenges through guided "realms" such as fear, doubt, anxiety, self-worth, forgiveness, and wisdom. The app features user authentication, progress tracking, and personal reflections, all backed by a PostgreSQL database (hosted on Supabase) and a modern React frontend.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Development](#development)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- User registration and login
- Secure password hashing (bcrypt)
- Guided realm-based experience (fear, doubt, anxiety, etc.)
- Progress tracking per realm
- Personal reflections/journaling
- Responsive, animated UI (React + Vite + Tailwind CSS)
- Supabase PostgreSQL backend

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Supabase)
- **ORM:** Drizzle ORM
- **Authentication:** Custom (bcrypt)
- **Other:** Zod (validation), dotenv, pg

---

## Project Structure

```
Inner_flame/
├── client/                # React frontend
│   └── src/
│       └── components/
│       └── lib/
│       └── hooks/
├── server/                # Express backend
│   └── index.ts
│   └── routes.ts
│   └── storage.ts
├── shared/                # Shared types and schema
│   └── schema.ts
├── .env                   # Environment variables
├── package.json
└── README.md
```

---

## Setup & Installation

### 1. Clone the repository

```sh
git clone https://github.com/Kevrollin/inner_flame.git
cd inner_flame
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root with the following content:

```
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
NODE_ENV=development
PORT=5000
```

> **Note:** Use your Supabase project's connection string for `DATABASE_URL`.

### 4. Set up the database

- Use the SQL schema in `shared/schema.ts` or the provided SQL in this README to create your tables in Supabase.
- You can use the Supabase SQL editor for this step.

### 5. Run the development server

```sh
npm run dev
```

- The app will be available at [http://localhost:5000](http://localhost:5000).

---

## Environment Variables

| Variable      | Description                              |
|---------------|------------------------------------------|
| DATABASE_URL  | PostgreSQL connection string (Supabase)  |
| NODE_ENV      | `development` or `production`            |
| PORT          | Port for the Express server (default 5000)|

---

## Database Schema

**Users Table**
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  current_realm TEXT DEFAULT 'fear',
  overall_progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**User Progress Table**
```sql
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  realm_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0 NOT NULL,
  is_unlocked BOOLEAN DEFAULT FALSE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, realm_id)
);
```

**Reflections Table**
```sql
CREATE TABLE IF NOT EXISTS reflections (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  realm_id TEXT,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

---

## Development

- **Frontend:**  
  The React app is served by the Express backend. All static files are built and served from the same port.
- **Backend:**  
  Express handles API routes and serves the frontend in production.
- **Hot reload:**  
  Use `npm run dev` for development with automatic reloads.

---

## API Endpoints

### Auth

- `POST /api/auth/register` — Register a new user  
  **Body:** `{ username, email, password }`

- `POST /api/auth/login` — Login  
  **Body:** `{ email, password }`

### Progress

- `GET /api/progress/:userId` — Get all progress for a user
- `PUT /api/progress/:userId/:realmId` — Update progress for a realm

### Reflections

- `POST /api/reflections` — Create a reflection  
  **Body:** `{ userId, realmId, content, metadata? }`
- `GET /api/reflections/:userId` — Get all reflections for a user

---

## Troubleshooting

- **DATABASE_URL is undefined:**  
  Make sure your `.env` file is in the project root and named `.env`.  
  The first line of `server/index.ts` must be `import 'dotenv/config';`.

- **400 Bad Request on register:**  
  Ensure your frontend sends `{ username, email, password }` as JSON and all fields are non-empty.

- **ECONNREFUSED:**  
  Your backend cannot connect to the database. Double-check your `DATABASE_URL` and Supabase credentials.

- **Frontend not loading:**  
  Visit [http://localhost:5000](http://localhost:5000). If you see an error, check the backend logs for details.

---

## License

MIT

---

**Made with ❤️ for personal