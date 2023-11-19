# core

Bun typescript framework/template built for creating rest style apps.

Notably it includes the entire source for the framework in the
`core` directory. It's a quite a light framework, but packed with
a utilities and patterns for making rapid app development easier,
especially with frameworks like htmx.

It isn't fully integrated with a frontend solution by design,
but it does included some utilities for making web components easier
and compiling client javascript. With the core being extensible
you can also adapt the framework to your needs over time.

## Views and Routes

Being a configuration over convention framework, it's easier to
find how something works and adjust it.

The main concepts to be familar with are views and routes. Views are can only ever respond to GET requests, but routes can respond to any request. Defined like so:

```tsx
import { view, route, define } from "core";

// Route path matching is handled by radix3
const home = view("/", async (req, params) => {
  // We provide our own jsx solution (based on hono/jsx)
  return <h1>Hello World</h1>;
});

const route = route("POST", "/", async () => {
  console.log("Post to /");
});

export default define({
  view: home,
  routes: [route],
});
```

and registered in the entry point: (what you run with `bun --watch run ...`)

```tsx
import { run } from "core";

import home from "~/routes/index";

run([home], (req) => {
  // This is an optional handler for intercepting requests
});
```

Once the request reaches the internal server it is handled in this order: `Route -> View`. If you don't `return` in a route, after the route is completed the view will displayed, and if no view exists for that route we will attempt to redirect to the referrer.

This allows you to easily utilise html forms for posting data to the server. In order to transfer data back to the client, we can update the "model" in an mvc fashion. We can either use an api to save to the database and have the view read it, or we can use our utility `createState` to create an store powered by unstorage which by default is stored in server memory (in a Map to be precise) but it can be changed to use something like redis.

Thanks to the referrer redirect system, we can call multiple different routes from a single view without any need for any javascript (by default html forms refresh the page on submit)

## Utilities

This is a short list main of the utilities included:

- createState (wrapper of unstorage)
- createApi (object based api with error/data result type)
- jsx (while views can return a Response, it's recommended to use jsx)
- serveStatic (can be used in run's intercept to serve a directory)

## Recomendations

While there is no convention, I would recommend organsing your
specific code like so:

```md
- src
  - api
  - routes
  - components
```

Use drizzle (as well as unstorage), it's pretty good. Also we include consola to make logs look a little nicer.
