import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import swc from '@vitejs/plugin-react-swc';
import ViteImagemin from 'vite-plugin-imagemin';
import { config } from 'dotenv';
import terser from '@rollup/plugin-terser';
import path from 'path';

config();

export default defineConfig(({ mode }) => {
  console.log('Vite config loaded. MODE:', mode);

  const isProduction = mode === 'production';
  console.log('isProduction: ' + isProduction);

  return {
    build: {
      minify: isProduction,
      rollupOptions: {
        output: isProduction
          ? {
              chunkFileNames: 'js/chunks/[name]-[hash].js',
              entryFileNames: 'js/application.js',
            }
          : {
              chunkFileNames: 'js/chunks/[name]-[hash].js',
              entryFileNames: 'js/[name].js',
              manualChunks(id) {
                const filePath = path.relative(__dirname, id);
                if (id.includes('node_modules')) return 'vendor';
                if (filePath.includes('src\\'))
                  return path.basename(filePath, path.extname(filePath));
              },
            },
        plugins: [
          // Solo minificar en producción o si se pasa el flag --mode
          isProduction &&
            terser({
              compress: {
                drop_console: true,
              },
              mangle: true,
              format: {
                comments: false,
              },
            }),
        ],
      },
    },
    base: './',
    resolve: {
      alias: {
        '@routes': '/src/routes',
        '@pages': '/src/pages',
        '@components': '/src/components',
        '@lib': '/src/lib',
        '@partials': '/src/components/_partials',
        '@hooks': '/src/components/_customHook',
        '@config': '/src/configApp',
        '@context': '/src/context',
        '@services': '/src/services',
        '@utils': '/src/utils',
        '@store': '/src/store',
      },
    },
    plugins: [
      react(),
      swc(),
      ViteImagemin({ 
        gifsicle: { optimizationLevel: 3, interlaced: true },
        mozjpeg: { quality: 75 },
        optipng: { optimizationLevel: 5 },
        pngquant: { quality: [0.6, 0.8], speed: 4 },
        svgo: {
          plugins: [
            { removeViewBox: false },
            { cleanupIDs: false },
          ]
        },
      }),
    ],
  };
});
