import consola from "consola";
import { colors } from "consola/utils";
import { createRouter } from "radix3";

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

const router = createRouter<{ method: Method; handler: Handler }>();

export function matchOn<T>(routes: [Method, string, T][]) {
  const matchRouter = createRouter<{
    handler: T;
    method: Method;
    index: number;
  }>();
  for (let i = 0; i < routes.length; i++) {
    const [method, pathname, handler] = routes[i];
    matchRouter.insert(pathname, { handler, method, index: i });
  }
  return (pathname: string, method: string) => {
    const m = matchRouter.lookup(pathname);
    if (!m || m.method !== method) return null;
    return { ...m, params: m.params || {} };
  };
}

export function match(pathname: string, method: string) {
  const m = router.lookup(pathname);
  if (!m || m.method !== method) return null;
  return { ...m, params: m.params || {} };
}

export function handle(method: Method, pathname: string, handler: Handler) {
  router.insert(pathname, { method, handler });
}

const notFound = {
  handler: () => new Response("Not Found", { status: 404 }),
  params: {},
};

export type Intercept = (
  req: Request,
) => void | Response | Promise<void | Response>;

export function serve(intercept?: Intercept) {
  const app = Bun.serve({
    async fetch(req) {
      if (intercept) {
        const res = await intercept(req);
        if (res) return res;
      }
      const pathname = new URL(req.url).pathname;
      const msg = `${colors.dim(req.method.padEnd(7))} ${pathname}`;
      console.time(msg);
      const { handler, params } = match(pathname, req.method) || notFound;
      const res = await handler(req, params);
      console.timeEnd(msg);
      return res;
    },
  });

  consola.success(`Listening on port ${app.port}`);
}
