import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 3000 },
  root: "src",
  build: {
    outDir: "../dist",
  },
});
