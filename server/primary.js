import cluster from "node:cluster";
import { availableParallelism } from "node:os";

export const setupPrimary = () => {
  //const numCPUs = availableParallelism();
  //console.log(`${numCPUs} cores available.`);

  for (let i = 0; i < 1; i++) {
    cluster.fork({ PORT: 3000 + i });
  }
};
