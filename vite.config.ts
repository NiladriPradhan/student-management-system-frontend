// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
    }),
  ],
});
