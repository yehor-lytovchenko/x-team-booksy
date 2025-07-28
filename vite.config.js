import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import postcssImport from 'postcss-import';
import postcssSortMediaQueries from 'postcss-sort-media-queries';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ command }) => {
  return {
    base: '/x-team-booksy/',
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    root: 'src',
    css: {
      postcss: {
        plugins: [
          postcssImport(),
          postcssSortMediaQueries({
            sort: 'mobile-first',
          }),
        ],
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        input: glob.sync('./src/*.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js';
            }
            return '[name].js';
          },
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      outDir: '../dist',
      emptyOutDir: true,
    },
    plugins: [
      injectHTML(),
      FullReload(['./src/**/**.html']),
      viteStaticCopy({
        targets: [
          {
            src: 'img/*', // папка с картинками
            dest: 'img', // папка назначения в dist
          },
        ],
      }),
    ],
  };
});
