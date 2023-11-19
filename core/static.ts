import path from "path";

export function serveStatic(
  req: Request,
  matcher: RegExp,
  transformer: (pathname: string) => string,
) {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);
  if (pathname.match(matcher)) {
    const file = path.join(process.cwd(), transformer(pathname));
    return new Response(Bun.file(file).stream());
  }
}
