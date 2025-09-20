import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(projectRoot, 'src', 'locales');
const targetDir = path.join(projectRoot, 'functions', 'locales');

async function ensureTargetDir() {
  await fs.mkdir(targetDir, { recursive: true });
}

async function copyLocaleFile(fileName) {
  const sourcePath = path.join(sourceDir, fileName);
  const targetPath = path.join(targetDir, fileName);
  const contents = await fs.readFile(sourcePath, 'utf8');
  await fs.writeFile(targetPath, contents, 'utf8');
  return targetPath;
}

async function syncLocales() {
  await ensureTargetDir();
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  const copied = [];

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    if (!entry.name.endsWith('.json')) {
      continue;
    }

    const resultPath = await copyLocaleFile(entry.name);
    copied.push(path.relative(projectRoot, resultPath));
  }

  return copied;
}

syncLocales()
  .then((copied) => {
    if (copied.length) {
      console.log(`Synced ${copied.length} locale file(s):`);
      copied.forEach((filePath) => console.log(` - ${filePath}`));
    } else {
      console.log('No locale files found to sync.');
    }
  })
  .catch((error) => {
    console.error('Failed to sync locales:', error);
    process.exitCode = 1;
  });
