import functions from 'firebase-functions';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname, 'locales');

const ensureLocalesDir = async () => {
  try {
    await fs.access(localesDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(localesDir, { recursive: true });
    } else {
      throw error;
    }
  }
};

const getFilePath = (lang) => path.join(localesDir, `${lang}.json`);

const parseRequestBody = async (req) => {
  if (req.body && Object.keys(req.body).length > 0) {
    return req.body;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  if (!chunks.length) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch (error) {
    throw new Error('Invalid JSON payload');
  }
};

const extractLanguage = (req) => {
  const match = req.path.match(/\/api\/translations\/(.+)$/);

  if (!match) {
    return null;
  }

  const [language] = match[1].split('/');
  return language ? decodeURIComponent(language) : null;
};

export const translationsApi = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const language = extractLanguage(req);

  if (!language) {
    res.status(400).json({ error: 'Language not specified' });
    return;
  }

  if (!/^[-a-zA-Z0-9_]+$/.test(language)) {
    res.status(400).json({ error: 'Invalid language code' });
    return;
  }

  try {
    await ensureLocalesDir();
  } catch (error) {
    functions.logger.error('Failed to initialize locales directory', error);
    res.status(500).json({ error: 'Failed to prepare translations store' });
    return;
  }

  const filePath = getFilePath(language);

  if (req.method === 'GET') {
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      res.json(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({ error: 'Language not found' });
      } else {
        functions.logger.error('Failed to load translations', error);
        res.status(500).json({ error: 'Failed to load translations' });
      }
    }

    return;
  }

  if (req.method === 'PUT') {
    let body;

    try {
      body = await parseRequestBody(req);
    } catch (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const { translations } = body;

    if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
      res.status(400).json({ error: 'Invalid translations payload' });
      return;
    }

    try {
      await fs.writeFile(filePath, `${JSON.stringify(translations, null, 2)}\n`, 'utf8');
      res.json({ success: true });
    } catch (error) {
      functions.logger.error('Failed to save translations', error);
      res.status(500).json({ error: 'Failed to save translations' });
    }

    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
});
