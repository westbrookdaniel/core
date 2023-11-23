import path from "path";

type Options = {
  root: string;
  removePrefix?: string;
};

export function serveDir(req: Request, options: Options) {
  const pathname = new URL(req.url).pathname;

  let f = pathname.replace(options.removePrefix || "", "");
  f = path.join(options.root, f);

  try {
    const file = path.join(process.cwd(), f);
    return new Response(Bun.file(file).stream());
  } catch (e) {
    console.error(e);
    return new Response("File not found", { status: 404 });
  }
}
