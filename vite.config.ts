import { type UserConfig } from "rolldown-vite";
import solidPlugin from "vite-plugin-solid";
import kumaUI from "@kuma-ui/vite";

export default {
  root: "src",
  cacheDir: "../node_modules/.vite",
  plugins: [
    solidPlugin(),
    (typeof kumaUI === "function" ? kumaUI : kumaUI.default)(),
  ],
  esbuild: false,
  build: {
    target: "esnext",
    outDir: "../dist",
    emptyOutDir: true,
  },
} satisfies UserConfig;
