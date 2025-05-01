import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],  // your entry file
  format: ['cjs', 'esm', 'iife'], // iife for browser <script>, cjs+esm for Node/npm
  globalName: 'SubsurgeSDK', // what global variable name to use in browser
  sourcemap: true,
  dts: true,   // generate types
  clean: true, // clean output folder before build
  outDir: 'dist',
  minify: true,
})
