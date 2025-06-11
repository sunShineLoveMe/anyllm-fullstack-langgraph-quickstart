import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: "/cloudthink/",
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: '47.113.196.109', // <--- 阿里云公网IP
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:2024",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      "/graphs": { // LangGraph 原生路径代理 (如果需要)
        target: "http://127.0.0.1:2024",
        changeOrigin: true,
      },
      "/openapi.json": { // LangGraph 原生路径代理 (如果需要)
        target: "http://127.0.0.1:2024",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
