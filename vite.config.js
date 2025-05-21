import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";
import react from '@vitejs/plugin-react-swc';
import path from "path";

export default defineConfig({
    plugins: [
        react(),
        symfonyPlugin(),
    ],
    build: {
        rollupOptions: {
            input: {
                app: "./assets/vite-app/main.tsx",
            },
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "assets/vite-app"),
        },
    },
});
