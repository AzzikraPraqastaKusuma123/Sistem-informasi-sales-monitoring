import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url'; 

// Dapatkan __dirname secara manual untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Arahkan semua impor 'react' ke satu lokasi (instance) yang sama
      'react': path.resolve(__dirname, 'node_modules/react'),
    },
  },
});