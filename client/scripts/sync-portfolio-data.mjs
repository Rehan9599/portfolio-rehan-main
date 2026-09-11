/**
 * Pulls the live portfolio payload from the API and writes it to
 * src/data/portfolio.json, which the app ships as its offline snapshot.
 *
 * Run `npm run sync:data` after changing content in the database, then commit
 * the updated JSON. The site then renders instantly from the snapshot and
 * quietly refreshes from the API in the background, so a cold or unreachable
 * backend never produces a blank page.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const API_URL =
  process.env.VITE_API_URL ||
  'https://rehanfazal-portfolio-api-fzeeeygmg9cdembb.eastasia-01.azurewebsites.net';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'portfolio.json');

const res = await fetch(`${API_URL}/api/portfolio`, { signal: AbortSignal.timeout(30_000) });
if (!res.ok) throw new Error(`API responded ${res.status}`);

const body = await res.json();
if (!body?.success || !body?.data) throw new Error('API returned an unexpected payload shape');

const { personalInfo, projects, skills, certificates, journey, journeyText } = body.data;
if (!personalInfo?.name || !Array.isArray(projects) || projects.length === 0) {
  throw new Error('Refusing to write an empty snapshot — check the database is seeded');
}

await writeFile(OUT, JSON.stringify({ personalInfo, projects, skills, certificates, journey, journeyText }, null, 2) + '\n');

console.log(
  `Snapshot written: ${projects.length} projects, ${certificates.length} certificates, ` +
  `${journey.length} journey entries, ${Object.keys(skills).length} skill categories`
);
