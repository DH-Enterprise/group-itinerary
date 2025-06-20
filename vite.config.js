import { defineConfig, loadEnv } from "vite";
import symfonyPlugin from "vite-plugin-symfony";
import react from '@vitejs/plugin-react-swc';
import path from "path";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables with VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');
  
  // Log the environment variables for debugging
  console.log('Vite environment variables:', {
    VITE_API_URL: env.VITE_API_URL || 'http://orion.test',
    NODE_ENV: process.env.NODE_ENV,
    MODE: mode
  });

  return {
    plugins: [
      react(),
      symfonyPlugin(),
    ],
    // Environment variables prefixed with VITE_ are automatically exposed to your client-side code
    // via import.meta.env.VITE_* (e.g., import.meta.env.VITE_API_URL)
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://orion.test')
    },
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
      cors: true,
      proxy: {
        // Proxy API requests to avoid CORS issues in development
        '^/admin': {
          target: env.VITE_API_URL || 'http://orion.test',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/admin/, '')
        }
      }
    }
  };
});
