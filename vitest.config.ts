import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    globals: true,
    environment: 'node',
    include: ["src/tests/**/*.test.ts"],
    // vite tries to fire up multiple instances of fastify app
    // which try to run on same port resulting in error.
    // TODO: find a better fix than turing file parallelism off
    // https://vitest.dev/guide/parallelism.html#file-parallelism
    fileParallelism: false,
  }

});
