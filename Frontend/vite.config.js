import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  tanstackRouter: {
    generatedRouteTree: "./src/routeTree.gen.js",
    routeFileIgnorePrefix: "-",
    quoteStyle: "single"
  },
  vite: {
    plugins: [
      {
        name: "delete-js-route-tree",
        buildStart() {
          const jsFile = resolve(__dirname, "./src/routeTree.gen.js");
          if (fs.existsSync(jsFile)) {
            fs.unlinkSync(jsFile);
          }
        },
      },
    ],
  },
  resolve: {
    tsconfigPaths: true,
  },
});