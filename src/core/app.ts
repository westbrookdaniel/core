import consola from "consola";
import { handle, serve, Method, matchOn, Intercept } from "./server";
import { HtmlEscapedString } from "./jsx/utils";

const [_, __, modeArg] = process.argv;
export const MODE: "dev" | "serve" = (modeArg ?? "dev") as any;
if (!["dev", "serve"].includes(MODE)) {
  consola.error("Invalid argument:", modeArg);
  consola.log("Expected: dev or serve\n");
  process.exit(1);
}

type ViewHandler = (
  params: Record<string, string>,
) => HtmlEscapedString | Promise<HtmlEscapedString>;
type RouteHandler = (
  req: Request,
  params: Record<string, string>,
) => Response | Promise<Response> | void | Promise<void>;

type IncludeAttr = Record<string, string> | undefined;

type View = [Method, string, ViewHandler];
type Route = [Method, string, RouteHandler];
type Def = { view: View; routes?: Route[] };

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
  return ["GET", pathname, viewHandler];
}

export function route(
  method: Method,
  pathname: string,
  routeHandler: RouteHandler,
): Route {
  return [method, pathname, routeHandler];
}

export function define(def: Def): Def {
  return def;
}

function respond(html: string) {
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

export async function run(defs: Def[], intercept?: Intercept) {
  consola.start("Starting server...");

  const views: View[] = [];
  const routes: Route[] = [];
  for (let i = 0; i < defs.length; i++) {
    const def = defs[i];
    views.push(def.view);
    if (def.routes) routes.push(...def.routes);
  }

  const match = matchOn(routes);

  views.forEach(([method, pathname, viewHandler]) => {
    const matchingRoute = match(method, pathname);

    if (matchingRoute) {
      routes.splice(matchingRoute.index, 1);

      handle(method, pathname, async (req, params) => {
        const resOption = await matchingRoute.handler(req, params);
        if (resOption) return resOption;

        const html = await viewHandler(params);
        return respond("<!doctype html>" + html);
      });
    } else {
      handle(method, pathname, async (_req, params) => {
        const html = await viewHandler(params);
        return respond("<!doctype html>" + html);
      });
    }
  });

  routes.forEach(([method, pathname, routeHandler]) => {
    handle(method, pathname, async (req, params) => {
      const resOption = await routeHandler(req, params);
      if (resOption) return resOption;
      const referer = req.headers.get("Referer");
      if (referer) {
        const view = new URL(referer).pathname;
        return Response.redirect(view, 301);
      }
      consola.error(
        "No referer, view, or response found for route: ",
        method,
        pathname,
      );
      return new Response("Something went wrong", { status: 500 });
    });
  });

  serve(intercept);
}

function shallowEqual(a: any, b: any): boolean {
  if (typeof a !== "object" || typeof b !== "object") return false;
  return Object.keys(a).every((key) => {
    if (a[key] !== b[key]) return false;
    return true;
  });
}
