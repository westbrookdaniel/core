import { view, route, define, z } from "core";
import { Layout } from "~/components/layout";
import { formRoute } from "core/validation";
import { api } from "~/api";
import { memory } from "~/state";

const errors = memory.newState("contacts:errors", {
  dispose: true,
  default: {},
});

const contacts = view("/contacts", async () => {
  const c = await api.contacts.getAll();

  if (c.error) throw new Error(c.error);

  return (
    <Layout>
      <main class="h-screen w-screen grid place-content-center text-center bg-neutral-800 text-neutral-400">
        <h1 class="text-8xl font-thin mb-8">Contacts</h1>
        <form action="/greet" method="POST" class="space-x-2" novalidate>
          <input
            type="text"
            name="name"
            placeholder="Name"
            class="border border-neutral-700 bg-neutral-800 py-2 px-4 rounded-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            class="border border-neutral-700 bg-neutral-800 py-2 px-4 rounded-full"
          />
          <button class="bg-neutral-700 py-2 px-4 rounded-full hover:bg-neutral-600 focus:bg-neutral-500">
            Create Contact
          </button>
        </form>

        <div class="mt-8 space-y-4">
          {c.data?.map((contact) => (
            <p>
              {contact.name} - {contact.email}
            </p>
          ))}
        </div>

        <div class="mt-16">
          <a href="/" class="hover:underline">
            &larr; Back
          </a>
        </div>
      </main>
    </Layout>
  );
});

// const greet = formRoute(
//   "POST",
//   "/greet",
//   z.object({ name: z.string() }),
//   async (_req, _params, opt) => {
//     if (!opt.success) throw new Error("Form not valid");

//     await errors.set(opt.data.name);
//   },
// );

export default define({
  view: contacts,
  routes: [],
});
