import { createServer, serveStatic } from "core";

import "~/layers/db";

import home from "~/views/index";
import contacts from "~/views/contacts";
import notFound from "~/views/notFound";

const serve = await createServer([home, contacts], {
  noView: notFound,
});

Bun.serve({
  async fetch(req) {
    const build = serveStatic(req, /^\/_static/, (p) =>
      p.replace("_static", "build"),
    );

    if (build) return build;

    const pub = serveStatic(req, /^\/_public/, (p) =>
      p.replace("_public", "public"),
    );

    if (pub) return pub;

    return serve(req);
  },
});
