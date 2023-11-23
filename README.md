# Core

This is a framework/template for building Bun/Typescript server first apps.
It follows the philosophies of:

- [REST](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- UI first (rather than model first, views are central to the app)
- Hackable (framework code lives in the repo)

This framework gives you a good starter for building apps quickly with an MVC
like structure. While nothing is required and you can shape the project to your desires
we scaffold the framework with some libraries that we thing are best suited for
our approach; [htmx](https://htmx.org/), [Drizzle](https://orm.drizzle.team/), [tailwindcss](https://tailwindcss.com/), and a few more.

Core also provides a jsx solution that is tweakable inside the `core` folder which is suited for serverside rendering with libraries like htmx.

## Routes and Views

The main notable difference is the layered router. By default (configurable by hacking the internals) the router has 2 layers, view and route. How layers work if a request path + method matches in a router layer it's handler will be called. If a response is returned (either jsx or Response) it will be sent to the user, but if the return is falsy, the request will fallthrough to the next layer. You can see examples of this in the starter routes. If there is nothing returned from any layer, the router will attempt to look at the Referer header and do a 303 (GET) redirect that router.

## Getting started

Start by installing dependencies and starting the dev server:

```sh
bun install
bun db:up # starts db, requires docker
bun dev
```

You can find the views and routes co-located in the routes folder, these will
be automatically imported. Here are some other notable folders:

```md
- core (the frameowork code)
- drizzle (db migrations live here)
- public (will be served statically)
- src
  - api (abstraction for data access for reusability and auditing)
  - components (components for your routes)
  - db (drizzle client and schema)
  - routes (views/routes live here)
    state.ts (features unstorage stores, useful for caching)
    styles.css (will be built to public/styles.css by tailwindcss)
```

Happy hacking!
