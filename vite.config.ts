
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    build: {
      outDir: 'build',
    },
    server: {
      port: 5173,
      open: true,
      fs: {
        // incluir raiz do projeto + pasta legacy como permitidas (evita 403 Restricted)
        allow: [
          path.resolve(__dirname),
          path.resolve(__dirname, 'legacy-backend', 'public'),
        ],
      },
      proxy: {
        '/generate-pdf': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path,
        },
        '/health': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  });