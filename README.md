# rehan.dev — MERN Stack Portfolio

Full-stack portfolio built with **MongoDB**, **Express**, **React**, and **Node.js**.

## Project Structure

```
portfolio/
├── client/          # React + Vite frontend
├── server/          # Express + MongoDB backend
└── package.json     # Root scripts (concurrently)
```

## Quick Start

### 1. Install all dependencies

```bash
npm run install:all
```

### 2. Set up MongoDB

Make sure MongoDB is running locally, or update `server/.env` with your MongoDB Atlas URI:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
```

### 3. Seed the database

```bash
npm run seed
```

### 4. Start development

```bash
npm run dev
```

This starts both:
- **Client** → `http://localhost:5173`
- **Server** → `http://localhost:5000`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client & server |
| `npm run client` | Start client only |
| `npm run server` | Start server only |
| `npm run seed` | Seed MongoDB with portfolio data |
| `npm run build` | Build client for production |
| `npm run install:all` | Install all dependencies |

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/portfolio` | All portfolio data |
| POST | `/api/contact` | Submit contact message |
| GET | `/api/contact` | List all messages |
| GET | `/api/health` | Server health check |

## Tech Stack

- **Frontend:** React 19, Vite, Framer Motion, Lucide Icons, Axios
- **Backend:** Express, Mongoose, CORS, dotenv
- **Database:** MongoDB

---

Designed & Built by **Rehan Fazal** • CS @ JMI '28
