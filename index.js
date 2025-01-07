import cluster from "node:cluster";
import { setupPrimary } from "./server/primary.js";
import { setupWorker } from "./server/worker.js";

if (cluster.isPrimary) {
  setupPrimary();
} else {
  setupWorker();
}

/**
 * Think of the primary process as a manager and worker processes as employees:

  The manager (primary) assigns tasks to employees (workers) and ensures everything runs smoothly.
  The employees (workers) do the actual work, like serving customers or performing specific operations.

 */
