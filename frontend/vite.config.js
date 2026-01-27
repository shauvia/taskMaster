import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with '/api'
      "/api": {
        target: "http://localhost:3001", // The address of your backend server
        changeOrigin: true, // Changes the origin header to match the target URL
        // rewrite: (path) => path.replace(/^\/api/, ''), // Rewrites the path: '/api/users' becomes '/users' on the backend
      },
    },
  },
});
