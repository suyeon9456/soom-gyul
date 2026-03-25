import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "soom-gyul",
  brand: {
    displayName: "soom-gyul",
    primaryColor: "#08c8d8",
    icon: "https://static.toss.im/appsintoss/29683/b987ef41-a4e9-46e2-a748-60dd1ad96203.png",
  },
  web: {
    host: "localhost",
    port: 3000,
    commands: {
      dev: "next dev",
      build: "next build",
    },
  },
  permissions: [],
  outdir: "dist",
});
