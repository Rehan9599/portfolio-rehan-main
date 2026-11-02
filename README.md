# rehan.dev — MERN Stack Portfolio

A personal portfolio built with modern frontend motion patterns and a small API
for the contact form. The live site is [rehanfazal.dev](https://rehanfazal.dev).
The repository contains the portfolio content and assets; it is not a
general-purpose starter project.
## Project Structure

```
portfolio/
├── client/          # React + Vite frontend
├── server/          # Express API for contact messages
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
- **Repository-backed data** — portfolio content is committed in `client/src/data/portfolio.json` and assets are committed under `client/public/assets`.

## Optimistic UI Design System

- A full **Optimistic UI component library** included in `client/src/ui/components`:
  badges, cards, inputs, modals, drawers, tabs, tables, snackbars, loaders, and more.
- Tokenized styling with dedicated `tokens.css` + scalable component CSS architecture.
- Reusable UI primitives ready for future feature expansion.

## Backend & Data Stack

- **Node.js + Express 4** API server with modular route design.
- **MongoDB + Mongoose 8** for contact messages only.
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

Portfolio content lives in the repository at
`client/src/data/portfolio.json` and is served by both the frontend and
`/api/portfolio`. MongoDB is only used for contact-form messages, so an Atlas
outage does not affect the portfolio itself.

There is no portfolio seed step. Update the JSON and matching files under
`client/public/assets`, then deploy the site. Database credentials and contact
messages remain private server configuration and are not included in this
repository.

## Development

This is Rehan's live portfolio, not a template intended for other people's
content. The deployed site is the canonical way to view it. Private server
environment variables, database access, and contact-message data are required
for the backend and are intentionally omitted.

## Environment

`server/.env`:

| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string for contact messages |
| `SMTP_USER` / `SMTP_PASS` | Gmail app credentials for contact notifications |
| `SMTP_TO` | Where contact messages are delivered (defaults to `SMTP_USER`) |
| `ADMIN_TOKEN` | **Required** to read `GET /api/contact`. Without it the route returns 404. |

`client/.env.production` sets `VITE_API_URL` to the deployed API origin.

---

Designed & Built by **Rehan Fazal** • CS @ JMI '28
