import { Router } from 'express';
import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

router.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

router.get('/:cssFile.css', (req, res) => {
  res.sendFile(join(__dirname, '../public/styles.css'));
});
router.get('/:script.js', (req, res) => {
  res.sendFile(join(__dirname, '../public/script.js'));
});

export default router;
