import { view, define, z, route } from "core";
import { Layout } from "~/components/layout";
import { formRoute } from "core/validation";
import { api } from "~/api";
import { memory } from "~/state";

const fields = memory.newState<Record<string, string>>("contacts:fields", {
  dispose: true,
  default: {},
});

const errors = memory.newState<Record<string, string[]>>("contacts:errors", {
  dispose: true,
  default: {},
});

const contacts = view("/contacts", async () => {
  const c = await api.contacts.getAll();
  const e = await errors.get();
  const f = await fields.get();

  if (c.error) throw new Error(c.error);

  console.log(e);

  return (
    <Layout>
      <main class="h-screen w-screen grid place-content-center text-center bg-neutral-800 text-neutral-400">
        <h1 class="text-8xl font-thin mb-8">Contacts</h1>
        <form
          action="/contacts"
          method="POST"
          class="flex flex-col text-left"
          novalidate
        >
          <label for="name" class="mb-4">
            Name
            <input
              type="text"
              name="name"
              value={f.name}
              class="block w-full border border-neutral-700 bg-neutral-800 py-2 my-1 px-4 rounded-full"
            />
            {!!e.name?.length && <span class="text-red-500">{e.name[0]}</span>}
          </label>
          <label for="email" class="mb-4">
            Email
            <input
              type="email"
              name="email"
              value={f.email}
              class="block w-full border border-neutral-700 bg-neutral-800 py-2 my-1 px-4 rounded-full"
            />
            {!!e.email?.length && (
              <span class="text-red-500">{e.email[0]}</span>
            )}
          </label>
          <button class="bg-neutral-700 py-2 px-4 rounded-full hover:bg-neutral-600 focus:bg-neutral-500">
            Create Contact
          </button>
        </form>

        <div class="mt-8 space-y-2">
          {c.data?.map((contact) => (
            <div class="flex items-center space-x-4">
              <p class="flex-grow text-left">
                {contact.name} - {contact.email}
              </p>
              <form
                action={`/contacts/${contact.id}`}
                method="DELETE"
                class="space-x-2"
                novalidate
              >
                <button
                  type="submit"
                  class="bg-neutral-700 py-2 px-4 rounded-full hover:bg-neutral-600 focus:bg-neutral-500"
                >
                  Delete
                </button>
              </form>
            </div>
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

const addContact = formRoute(
  "POST",
  "/contacts",
  z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Email is invalid"),
  }),
  async (_req, _params, opt, raw) => {
    if (!opt.success) {
      await errors.set(opt.error.flatten().fieldErrors);
      await fields.set(raw);
      return;
    }
    await api.contacts.create(opt.data);
  },
);

const deleteContact = route("DELETE", "/contacts/:id", async (_req, params) => {
  if (!params.id) throw new Error("Something went wrong");
  await api.contacts.delete(parseInt(params.id));
});

const jsonContacts = route("GET", "/contacts.json", async () => {
  return Response.json(await api.contacts.getAll());
});

export default define({
  view: contacts,
  routes: [addContact, deleteContact, jsonContacts],
});
