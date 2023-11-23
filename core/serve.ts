import { serve, serveDir } from "./internal";
import { globSync } from "glob";

import "~/db";

globSync("~/routes/**/*").forEach((path) => {
  import(path);
});

Bun.serve({
  async fetch(req) {
    const pathname = new URL(req.url).pathname;

    if (pathname.startsWith("/_static")) {
      return serveDir(req, {
        root: "build",
        removePrefix: "/_static",
      });
    }

    if (pathname.startsWith("/_public")) {
      return serveDir(req, {
        root: "public",
        removePrefix: "/_public",
      });
    }

    return serve(req);
  },
});
