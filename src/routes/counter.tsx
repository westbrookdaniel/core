import { define, route, view, z } from "../core";
import { Layout } from "../layout";
import { newState } from "../state";

const state = newState<number>("counter:count", { default: 0 });

const counter = view("/counter", async () => {
  const id = Math.random().toString(36).substring(2);
  const count = await state.get();
  return (
    <Layout>
      <h1>Counter</h1>
      <button onclick="inc()">Increment</button>
      <button onclick="dec()">Decrement</button>
      <button onclick="save()">Save</button>
      <span style="margin-left: 8px" id={id}>
        {count.toString()}
      </span>

      <script
        dangerouslySetInnerHTML={{
          __html: `
        count = ${count};

        function inc() {
          count++;
          render();
        }
        function dec() {
          count--;
          render();
        }
        function render() {
          document.getElementById("${id}").innerText = count;
        }

        function save() {
          fetch("/p/counter", {
            method: "POST",
            body: JSON.stringify({ count }),
          });
        }`,
        }}
      />
    </Layout>
  );
});

const bodySchema = z.object({ count: z.number() });

const saveCounter = route("POST", "/p/counter", async (req) => {
  const opt = bodySchema.safeParse(await req.json());
  if (!opt.success) return;
  await state.set(opt.data.count);
});

export default define({
  view: counter,
  routes: [saveCounter],
});
