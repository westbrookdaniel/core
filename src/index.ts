import { serveDir, serve } from "core";

import "~/layers/db";

import "~/routes/notFound";
import "~/routes/index";
import "~/routes/contacts";

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
