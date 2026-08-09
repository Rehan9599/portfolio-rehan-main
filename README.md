# rehan.dev — MERN Stack Portfolio

A full-stack, interaction-heavy portfolio built with modern frontend motion patterns, a custom data-driven backend, and clean API architecture.

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
| GET | `/api/contact` | Returns submitted contact messages |
| GET | `/api/health` | Server health check |

---

Designed & Built by **Rehan Fazal** • CS @ JMI '28
