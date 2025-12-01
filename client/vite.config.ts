import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

});
