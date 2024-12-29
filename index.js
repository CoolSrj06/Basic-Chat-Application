import cluster from 'node:cluster';
import { setupPrimary } from './server/primary.js';
import { setupWorker } from './server/worker.js';

if (cluster.isPrimary) {
  setupPrimary();
} else {
  setupWorker();
}
