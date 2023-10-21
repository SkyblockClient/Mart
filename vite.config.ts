import { PluginOption, defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const neutralinoBuildPlugin: PluginOption = {
    name: "neutralino-build",
    enforce: "post",
    apply: "build",
    generateBundle(options, bundle) {
      const indexHtml = bundle["index-neutralino.html"];
      indexHtml.fileName = "index.html";
    },
  };
  const neutralinoOptions = {
    input: {
      index: resolve(__dirname, "index-neutralino.html"),
    },
  };
  return {
    plugins: [
      svelte(),
      mode == "neutralino" ? neutralinoBuildPlugin : undefined,
    ],
    build: {
      rollupOptions: mode == "neutralino" ? neutralinoOptions : undefined,
      target: "es2020",
      outDir: "build",
    },
  };
});
