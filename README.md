# rehan.dev — MERN Stack Portfolio

A full-stack, interaction-heavy portfolio built with modern frontend motion patterns, a custom data-driven backend, and clean API architecture.
live at [rehanfazal.dev](https://rehanfazal.dev)
## Project Structure

```
portfolio/
├── client/          # React + Vite frontend
├── server/          # Express + MongoDB backend
└── package.json     # Root orchestration scripts
```

## Frontend Experience Stack

- **React 19 + Vite** for fast, modern UI architecture and performance.
- **HeroBento layout** as the signature landing experience.
- **Framer Motion** for staggered reveals, transitions, and interactive section animations.
- **Lenis** smooth-scroll engine for fluid scroll behavior on mobile sections.
- **Lucide React** iconography and consistent visual language.
- **TerminalBoot intro + custom cursor trail + interaction audio** for a distinct personal-brand feel.
- **Axios API layer + custom hooks** (`usePortfolioData`, responsive hooks) for clean data flow.
- **Snapshot-first data loading** — the site renders from a committed JSON snapshot instantly, then swaps in live API data in the background, so a cold backend never blocks first paint.

## Optimistic UI Design System

- A full **Optimistic UI component library** included in `client/src/ui/components`:
  badges, cards, inputs, modals, drawers, tabs, tables, snackbars, loaders, and more.
- Tokenized styling with dedicated `tokens.css` + scalable component CSS architecture.
- Reusable UI primitives ready for future feature expansion.

## Backend & Data Stack

- **Node.js + Express 4** API server with modular route design.
- **MongoDB + Mongoose 8** models for portfolio content, skills, projects, certificates, journey, and contact messages.
- **Parallelized data fetching** in portfolio API via `Promise.all` for better response performance.
- **Nodemailer** integration for contact-form email notifications.
- **CORS origin allowlist + dotenv configuration** for secure environment handling.
- **Health endpoint and static asset serving** for reliability and deploy readiness.

## API Surface

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/portfolio` | Returns complete portfolio data payload |
| POST | `/api/contact` | Accepts and stores contact messages + triggers email notification |
| GET | `/api/contact` | Admin inbox — requires the `X-Admin-Token` header |
| GET | `/api/health` | Server health check |

## Content Workflow

Portfolio content lives in MongoDB and is served by `/api/portfolio`, but the
front end ships a committed snapshot of that payload so the site is never
blank while the backend cold-starts.

```bash
cd server && npm run seed     # push content changes into MongoDB
cd client && npm run sync:data # refresh client/src/data/portfolio.json
git add client/src/data/portfolio.json && git commit
```

## Environment

`server/.env`:

| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `SMTP_USER` / `SMTP_PASS` | Gmail app credentials for contact notifications |
| `SMTP_TO` | Where contact messages are delivered (defaults to `SMTP_USER`) |
| `ADMIN_TOKEN` | **Required** to read `GET /api/contact`. Without it the route returns 404. |

`client/.env.production` sets `VITE_API_URL` to the deployed API origin.

---

Designed & Built by **Rehan Fazal** • CS @ JMI '28
