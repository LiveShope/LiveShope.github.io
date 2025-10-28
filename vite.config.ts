import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // Root path untuk LiveShope.github.io
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    host: "::", // IP address yang bisa diakses, gunakan "::" untuk mendengarkan di semua alamat
    port: 8080, // Port untuk development server
  },
  plugins: [
    react(), // Plugin React (dengan SWC untuk kecepatan)
    mode === "development" && componentTagger(), // Aktifkan plugin 'componentTagger' di mode development
  ].filter(Boolean), // Filter untuk hanya menggunakan plugin yang valid
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias untuk folder src
    },
  },
}));
