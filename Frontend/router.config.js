import { defineConfig } from '@tanstack/router-generator'

export default defineConfig({
  routesDirectory: './src/routes',
  generatedRouteTree: './src/routeTree.gen.js',
  disableTypescript: true,
})
