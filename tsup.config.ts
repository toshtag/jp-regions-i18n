import { defineConfig } from "tsup";

const LANG_ENTRIES = ["ja", "en", "en-macrons", "zh-CN", "zh-TW", "ko", "pt", "vi"];

export default defineConfig({
  entry: ["src/index.ts", ...LANG_ENTRIES.map((l) => `src/${l}.ts`)],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  tsconfig: "tsconfig.build.json",
});
