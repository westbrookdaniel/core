import { z } from "zod";
import { Method, RouteHandler } from "./server";
import { Route } from "./app";

type FormRouteHandler<I, O> = (
  req: Request,
  params: Record<string, string>,
  opt: z.SafeParseReturnType<I, O>,
) => Response | Promise<Response> | void | Promise<void>;

export function formRoute<I>(
  method: Method,
  pathname: string,
  zodSchema: z.ZodType<I>,
  formRouteHandler: FormRouteHandler<I, I>,
): Route {
  const routeHandler: RouteHandler = async (req, params) => {
    const data = zodSchema.safeParse(Object.fromEntries(await req.formData()));
    return formRouteHandler(req, params, data);
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
    const data = zodSchema.safeParse(Object.fromEntries(await req.json()));
    return formRouteHandler(req, params, data);
  };

  return [method, pathname, routeHandler];
}
