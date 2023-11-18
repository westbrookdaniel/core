import { define, route, view } from "../core";
import { Layout } from "../layout";
import { state } from "../state";

const counter = view("/counter", async () => {
  const id = Math.random().toString(36).substring(2);
  const count = await state.counter.count.get();
  return (
    <Layout>
      <h1>Counter</h1>
      <button onclick="inc()">Increment</button>
      <button onclick="dec()">Decrement</button>
      <button onclick="save()">Save</button>
      <span style="margin-left: 8px" id={id}>
        {count}
      </span>

      <script>{`
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
        }
    `}</script>
    </Layout>
  );
});

const saveCounter = route("POST", "/p/counter", async (req) => {
  const data = await req.json();
  if (typeof data.count !== "number") return;
  await state.counter.count.set(data.count);
});

export default define({
  view: counter,
  routes: [saveCounter],
});
