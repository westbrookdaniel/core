import { view, define, z, route } from "core";
import { Layout } from "~/components/Layout";
import { formRoute } from "core/validation";
import { api } from "~/api";
import { CreateContactsForm } from "~/components/CreateContactsForm";

const contacts = view("/contacts", async () => {
  const c = await api.contacts.all();

  if (c.error) throw new Error(c.error);

  return (
    <Layout>
      <main class="h-screen w-screen grid place-content-center text-center bg-neutral-800 text-neutral-400">
        <h1 class="text-8xl font-thin mb-8">Contacts</h1>

        <CreateContactsForm />

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
      return (
        <CreateContactsForm
          errors={opt.error.flatten().fieldErrors}
          fields={raw}
        />
      );
    }
    await api.contacts.create(opt.data);
    return Response.redirect("/contacts");
  },
);

const deleteContact = route("DELETE", "/contacts/:id", async (_req, params) => {
  if (!params.id) throw new Error("Something went wrong");
  await api.contacts.delete(parseInt(params.id));
});

export default define({
  view: contacts,
  routes: [addContact, deleteContact],
});
