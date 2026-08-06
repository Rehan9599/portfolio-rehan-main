import express from 'express';
import cors from 'cors';
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

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Vite local development
  'http://localhost:3000', // React local development
  'https://rehanfazal.dev' // Azure Frontend URL
];

app.use(cors({
  origin: 'https://rehanfazal.dev',
  credentials: true,
}));
app.use(express.json());

// Serve static assets (project images, certificates, etc.)
app.use('/assets', express.static(join(__dirname, '.', 'src', 'assets')));

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
