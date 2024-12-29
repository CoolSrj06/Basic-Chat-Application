import { Router } from 'express';
import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

router.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

export default router;
