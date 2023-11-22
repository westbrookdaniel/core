import { z } from "zod";
import { Method, RouteHandler } from "./server";
import { Route } from "./app";
import { HtmlEscapedString } from "./jsx/utils";

type FormRouteHandler<I, O> = (
  req: Request,
  params: Record<string, string>,
  opt: z.SafeParseReturnType<I, O>,
  raw: Record<string, any>,
) =>
  | Response
  | void
  | HtmlEscapedString
  | Promise<Response | void | HtmlEscapedString>;

export function formRoute<I>(
  method: Method,
  pathname: string,
  zodSchema: z.ZodType<I>,
  formRouteHandler: FormRouteHandler<I, I>,
): Route {
  const routeHandler: RouteHandler = async (req, params) => {
    const raw = Object.fromEntries(await req.formData());
    const data = zodSchema.safeParse(raw);
    return formRouteHandler(req, params, data, raw);
  };

  return [method, pathname, routeHandler];
}

export function jsonRoute<I>(
  method: Method,
  pathname: string,
  zodSchema: z.ZodType<I>,
  formRouteHandler: FormRouteHandler<I, I>,
): Route {
  const routeHandler: RouteHandler = async (req, params) => {
    const raw = Object.fromEntries(await req.json());
    const data = zodSchema.safeParse(raw);
    return formRouteHandler(req, params, data, raw);
  };

  return [method, pathname, routeHandler];
}
