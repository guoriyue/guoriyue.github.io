import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  build: { target: 'chrome86', cssTarget: 'chrome86' },
  plugins: [vinext()],
});
