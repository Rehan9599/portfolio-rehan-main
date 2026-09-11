import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import connectDB from './config/db.js';
import portfolioRoutes from './routes/portfolio.js';
import contactRoutes from './routes/contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Azure App Service sits behind a reverse proxy; without this the rate
// limiter sees every request as coming from the same proxy IP.
app.set('trust proxy', 1);

app.use(helmet({
  // The API serves JSON and static assets to a different origin (the SWA
  // front end), so cross-origin reads have to stay allowed.
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

const allowedOrigins = [
  'http://localhost:3000', // React default (CRA)
  'http://localhost:5173', // Vite default
  'https://rehanfazal.dev',
  'https://www.rehanfazal.dev'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or local postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Token'],
  credentials: true
}))

// Cap the body size — nothing this API accepts is anywhere near 100kb.
app.use(express.json({ limit: '100kb' }));

// Serve static assets (project images, certificates, etc.)
app.use('/assets', express.static(join(__dirname, '.', 'src', 'assets'), {
  maxAge: '7d'
}));

// Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Express server immediately
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Express server running on http://127.0.0.1:${PORT}`);
  // Attempt DB connection in background
  connectDB();
});
