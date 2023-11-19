import { view, route, define } from "core";
import { memory } from "~/state";
import { Layout } from "~/components/layout";

const count = memory.newState<number>("home:count", { default: 0 });

const home = view("/", async () => {
  const c = await count.get();

  return (
    <Layout>
      <main class="h-screen w-screen grid place-content-center text-center bg-neutral-800 text-neutral-400">
        <h1 class="text-8xl font-thin mb-6">Welcome to Core</h1>
        <p class="mb-4">A simple framework for server based web apps</p>
        <form method="POST" class="space-x-2 mb-4">
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
      </main>
    </Layout>
  );
});

const incCount = route("POST", "/", async () => {
  await count.set((c) => c + 1);
});

export default define({
  view: home,
  routes: [incCount],
});
