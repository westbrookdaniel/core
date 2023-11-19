import { view, route, define, z } from "core";
import { memory } from "~/state";
import { Layout } from "~/components/layout";

const count = memory.newState<number>("home:count", { default: 0 });
const greeting = memory.newState<string>("home:greet", { dispose: true });

const home = view("/", async () => {
  const c = await count.get();
  const g = await greeting.get();

  return (
    <Layout>
      <main class="h-screen w-screen grid place-content-center text-center bg-neutral-800 text-neutral-400">
        {!!g ? (
          <h1 class="text-8xl font-thin mb-6">
            Hey {g},
            <br />
            Welcome to Core
          </h1>
        ) : (
          <h1 class="text-8xl font-thin mb-6">Welcome to Core</h1>
        )}
        <p class="mb-4">A simple framework for server based web apps</p>
        <form method="POST" class="space-x-2 mb-32">
          <button
            is="count-button"
            count={0}
            type="button"
            class="bg-neutral-700 py-2 px-4 rounded-full hover:bg-neutral-600 focus:bg-neutral-500"
          >
            Client Count 0
          </button>
          <button class="bg-neutral-700 py-2 px-4 rounded-full hover:bg-neutral-600 focus:bg-neutral-500">
            Server Count {c.toString()}
          </button>
        </form>
        <form action="/greet" method="POST" class="space-x-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            class="border border-neutral-700 bg-neutral-800 py-2 px-4 rounded-full"
          />
          <button class="bg-neutral-700 py-2 px-4 rounded-full hover:bg-neutral-600 focus:bg-neutral-500">
            Update Greeting
          </button>
        </form>
      </main>
    </Layout>
  );
});

const incCount = route("POST", "/", async () => {
  await count.set((c) => c + 1);
});

const greetSchema = z.object({ name: z.string() });

const greet = route("POST", "/greet", async (req) => {
  const form = Object.fromEntries(await req.formData());
  const opt = greetSchema.safeParse(form);
  if (!opt.success) throw new Error("Form not valid");

  await greeting.set(opt.data.name);
});

export default define({
  view: home,
  routes: [incCount, greet],
});
