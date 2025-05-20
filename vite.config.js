import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";
import react from '@vitejs/plugin-react-swc';
import path from "path";
// import {viteSingleFile} from "vite-plugin-singlefile";

export default defineConfig({
    plugins: [
        react(),
        symfonyPlugin(),
        // viteSingleFile(),
    ],
    build: {
        rollupOptions: {
            input: {
                app: "./assets/vite-app/main.tsx",
            },
        }
    },
    // base: "./",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "assets/vite-app"),
        },
    },
});
