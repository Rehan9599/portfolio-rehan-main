import express from 'express';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const router = express.Router();
const snapshotPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'client',
  'src',
  'data',
  'portfolio.json'
);
const portfolioSnapshot = JSON.parse(readFileSync(snapshotPath, 'utf8'));

// Portfolio content is versioned with the app; MongoDB is only needed for contact messages.
router.get('/', (req, res) => {
  res.json({
    success: true,
    source: 'repository',
    data: portfolioSnapshot
  });
});

export default router;