import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // GitHub Pages serves from repo root for username.github.io repos
  base: '/',

  // ── Multi-Page App ──────────────────────────────────────────────
  build: {
    rollupOptions: {
      input: {
        main:     resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html'),
        blog:     resolve(__dirname, 'blog.html'),
      },
      output: {
        // Put all JS/CSS into an "assets" sub-folder for cleanliness
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',

        // Split vendor chunks to improve caching
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },

    // Raise the warning threshold a little for large icon/image bundles
    chunkSizeWarningLimit: 600,

    // Minify with esbuild (default, but explicit)
    minify: 'esbuild',

    // Generate source maps only in dev
    sourcemap: false,

    // Output to "dist" (Vite default, suitable for GitHub Actions deploy)
    outDir: 'dist',

    // Clear output before every build
    emptyOutDir: true,
  },

  // ── Dev Server ───────────────────────────────────────────────────
  server: {
    port: 3000,
    open: true,          // Auto-open browser on `npm run dev`
    // Serve blog sub-pages correctly during dev
    fs: {
      allow: ['.'],
    },
  },

  // ── Preview Server (matches GitHub Pages behaviour) ──────────────
  preview: {
    port: 4173,
    open: true,
  },

  // ── CSS ──────────────────────────────────────────────────────────
  css: {
    devSourcemap: true,
  },
});
