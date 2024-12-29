import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';

export const initializeClusterAdapter = () => {
  if (cluster.isPrimary) {
    setupPrimary();
  }
  return createAdapter();
};
