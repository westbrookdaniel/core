import { run, serveStatic } from "core";

import "~/db";

import home from "~/routes/index";

run([home], async (req) => {
  const build = serveStatic(req, /^\/_static/, (p) =>
    p.replace("_static", "build"),
  );

  if (build) return build;

  const pub = serveStatic(req, /^\/_public/, (p) =>
    p.replace("_public", "public"),
  );

  if (pub) return pub;
});
