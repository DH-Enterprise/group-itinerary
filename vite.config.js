import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";
import react from '@vitejs/plugin-react-swc';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    symfonyPlugin(),
  ],
  build: {
    rollupOptions: {
      input: {
        app: "./assets/vite-app/src/main.tsx",
      },
    },
    target: 'esnext',
    sourcemap: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "assets/vite-app/src"),
    },
  },
  server: {
    cors: true
  }
});
