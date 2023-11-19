import path from "path";
import { run } from "core";

import "~/db";

import home from "~/routes/index";

run([home], async (req) => {
  const pathname = new URL(req.url).pathname;

  if (pathname.startsWith("/_static")) {
    const file = path.join(process.cwd(), pathname.replace("_static", "build"));
    return new Response(Bun.file(file).stream());
  }

  if (pathname.startsWith("/_public")) {
    const file = path.join(
      process.cwd(),
      pathname.replace("_public", "public"),
    );
    return new Response(Bun.file(file).stream());
  }
});
