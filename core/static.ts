import path from "path";

export function serveStatic(
  req: Request,
  matcher: RegExp,
  transformer: (pathname: string) => string,
) {
  const pathname = new URL(req.url).pathname;
  if (pathname.match(matcher)) {
    try {
      const file = path.join(process.cwd(), transformer(pathname));
      return new Response(Bun.file(file).stream());
    } catch (e) {
      console.error(e);
      return new Response("File not found", { status: 404 });
    }
  }
}
