import { handleRoute, handleView, serve, Method, RouteHandler } from "./server";
import { HtmlEscapedString } from "./jsx/utils";

const [_, __, modeArg] = process.argv;
export const MODE: "dev" | "serve" = (modeArg ?? "dev") as any;
if (!["dev", "serve"].includes(MODE)) {
  console.error("Invalid argument:", modeArg);
  console.log("Expected: dev or serve\n");
  process.exit(1);
}

export type ViewHandler = (
  req: Request,
  params: Record<string, string>,
) => HtmlEscapedString | Response | Promise<Response | HtmlEscapedString>;

type IncludeAttr = Record<string, string> | undefined;

export type View = [string, ViewHandler];
export type Route = [Method, string, RouteHandler];
export type Def = { view: View; routes?: Route[] };

const included: [string, IncludeAttr][] = [];

// TODO: This should build the file
export function include(filePath: string, attributes?: IncludeAttr) {
  if (
    included.find(([fp, a]) => fp === filePath && shallowEqual(a, attributes))
  ) {
    return;
  }
  included.push([filePath, attributes]);
}

export function view(pathname: string, viewHandler: ViewHandler): View {
  return [pathname, viewHandler];
}

export function noView(viewHandler: ViewHandler) {
  return viewHandler;
}

export function define(def: Def): Def {
  return def;
}

export function route(
  method: Method,
  pathname: string,
  routeHandler: RouteHandler,
): Route {
  return [method, pathname, routeHandler];
}

function returnHtml(html: string) {
  let str = html;
  included.forEach(([mod, attributes]) => {
    const src = mod;
    const attr = attributes
      ? Object.entries(attributes)
          .map(([k, v]) => `${k}="${v}"`)
          .join(" ") + " "
      : "";
    str = str.replace(
      /<\/body>/,
      `<script ${attr}src="${src}"></script></body>`,
    );
  });

  return new Response(str, {
    headers: { "Content-Type": "text/html" },
  });
}

export async function createServer(
  defs: Def[],
  options?: { noView?: ViewHandler },
) {
  console.log("Starting server...");

  const views: View[] = [];
  const routes: Route[] = [];
  for (let i = 0; i < defs.length; i++) {
    const def = defs[i];
    views.push(def.view);
    if (def.routes) routes.push(...def.routes);
  }

  views.forEach(([pathname, viewHandler]) => {
    handleView(pathname, async (req, params) => {
      const html = await viewHandler(req, params);
      if (html instanceof Response) return html;
      return returnHtml("<!doctype html>" + html);
    });
  });

  routes.forEach(([method, pathname, routeHandler]) => {
    handleRoute(method, pathname, async (req, params) => {
      const html = await routeHandler(req, params);
      if (html instanceof Response) return html;
      if (html) return returnHtml("<!doctype html>" + html);
    });
  });

  async function notFound(req: Request, params: Record<string, string>) {
    if (options?.noView) {
      const html = await options.noView(req, params);
      if (html instanceof Response) return html;
      return returnHtml("<!doctype html>" + html);
    }
    return new Response("Not Found", { status: 404 });
  }

  return (req: Request) => serve(req, notFound);
}

function shallowEqual(a: any, b: any): boolean {
  if (typeof a !== "object" || typeof b !== "object") return false;
  return Object.keys(a).every((key) => {
    if (a[key] !== b[key]) return false;
    return true;
  });
}
