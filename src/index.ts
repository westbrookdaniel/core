import { createServer, serveStatic } from "core";

import "~/db";

import home from "~/routes/index";
import contacts from "~/routes/contacts";
import notFound from "~/routes/notFound";

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
