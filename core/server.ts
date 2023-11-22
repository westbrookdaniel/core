import { createRouter } from "radix3";
import { HtmlEscapedString } from "./jsx/utils";

export type Method =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS"
  | "CONNECT"
  | "TRACE";

export type Handler = (
  req: Request,
  params: Record<string, string>,
) => Promise<Response> | Response;

export type RouteHandler = (
  req: Request,
  params: Record<string, string>,
) =>
  | Response
  | void
  | HtmlEscapedString
  | Promise<void | Response | HtmlEscapedString>;

// Map from Method to Handler (typed as string for convenience)
const viewRouter = createRouter<{ handler: Handler }>();
const router = createRouter<{ handlers: Record<string, RouteHandler> }>();

export function matchRoute(pathname: string, method: string) {
  const m = router.lookup(pathname);
  if (!m || !m.handlers[method]) return null;
  return { handler: m.handlers[method], params: m.params || {} };
}

export function handleView(pathname: string, handler: Handler) {
  viewRouter.insert(pathname, { handler });
}

export function handleRoute(
  method: Method,
  pathname: string,
  handler: RouteHandler,
) {
  const m = router.lookup(pathname);
  if (!m) return router.insert(pathname, { handlers: { [method]: handler } });
  m.handlers[method] = handler;
}

export async function serve(req: Request, notFound: Handler) {
  const pathname = new URL(req.url).pathname;
  const msg = `${req.method.padEnd(7)} ${pathname}`;
  console.time(msg);

  const routeMatch = matchRoute(pathname, req.method);
  const res = await routeMatch?.handler(req, routeMatch.params);
  if (res) {
    console.timeEnd(msg);
    return res;
  }

  const viewMatch = viewRouter.lookup(pathname);
  const viewRes = await viewMatch?.handler(req, viewMatch.params!);
  if (viewRes) {
    console.timeEnd(msg);
    return viewRes;
  }

  const referer = req.headers.get("Referer");
  if (referer) {
    const view = new URL(referer).pathname;
    return Response.redirect(view);
  }

  return notFound(req, {});
}
