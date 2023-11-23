import { HtmlEscapedString } from "./jsx/utils";
import { createRouter as createRadixRouter } from "radix3";

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
) => Response | void | Request | Promise<Response | void | Request>;

export type LayerHandler = (
  req: Request,
  params: Record<string, string>,
) =>
  | HtmlEscapedString
  | Response
  | void
  | Request
  | Promise<Response | HtmlEscapedString | void | Request>;

export type FallbackHandler = (
  req: Request,
  params: Record<string, string>,
) =>
  | HtmlEscapedString
  | Response
  | Request
  | Promise<Response | HtmlEscapedString | Request>;

type RouterData = { handlers: Record<string, Handler> };

type Router<T extends string> = Record<
  T,
  Record<Method, (pathname: string, handler: LayerHandler) => void>
> & {
  notFound: (handler: FallbackHandler) => void;
};

type CreateRouterReturn<T extends string> = {
  router: Router<T>;
  serve: (req: Request) => Promise<Response>;
};

function createRouter<T extends string>(layers: T[]): CreateRouterReturn<T> {
  const router: any = {};
  const _routers = layers.map((layer) => {
    return [layer, createRadixRouter<RouterData>()] as const;
  });
  let notFound: FallbackHandler | undefined;

  layers.forEach((layer) => {
    router[layer] = new Proxy<any>(
      {},
      {
        get(_, prop: Method) {
          const r = _routers.find(([l]) => l === layer)?.[1];
          if (!r) throw new Error(`Layer "${layer}" not found`);

          return (pathname: string, handler: LayerHandler) => {
            async function handle(
              req: Request,
              params: Record<string, string>,
            ) {
              const res = await handler(req, params);
              if (res instanceof Response) return res;
              if (res) return returnHtml("<!doctype html>" + res);
            }
            r.insert(pathname, { handlers: { [prop]: handle } });
          };
        },
      },
    );
  });

  router["notFound"] = (handler: FallbackHandler) => {
    notFound = handler;
  };

  async function serve(req: Request) {
    const pathname = new URL(req.url).pathname;
    const method = req.method;

    let _req = req;
    for (let i = 0; i < _routers.length; i++) {
      const r = _routers[i][1];
      const m = r.lookup(pathname);
      if (!m || !m.handlers[method]) continue;
      const handler = m.handlers[method];
      const params = m.params || {};
      const res = await handler(_req, params);
      if (res instanceof Response) return res;
      if (res) _req = res;
    }

    const referer = req.headers.get("Referer");
    if (referer) {
      const view = new URL(referer).pathname;
      // 303 See Other (do redirect as GET)
      return Response.redirect(view, 303);
    }

    if (notFound) {
      const res = await notFound(req, {});
      if (res instanceof Response) return res;
      return returnHtml("<!doctype html>" + res);
    }

    return new Response("Not found", { status: 404 });
  }

  return { router, serve };
}

function returnHtml(html: string) {
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}

export const { router, serve } = createRouter(["view", "route"]);
