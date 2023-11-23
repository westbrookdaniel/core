import { serve, serveDir } from "./internal";
import { globSync } from "glob";

import "~/db";

const files = globSync("./src/routes/**/*");

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  await import(file);
}

Bun.serve({
  async fetch(req) {
    const pathname = new URL(req.url).pathname;

    if (pathname.startsWith("/_public")) {
      return serveDir(req, {
        root: "public",
        removePrefix: "/_public",
      });
    }

    return serve(req);
  },
});
