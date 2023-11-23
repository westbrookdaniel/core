import { z, router, validate } from "core";
import { Layout } from "~/components/Layout";
import { api } from "~/api";
import { CreateContactsForm } from "~/components/contacts/CreateContactsForm";

router.view.GET("/contacts", async () => {
  const c = await api.contact.all();

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

router.route.POST("/contacts", async (req) => {
  const { parsed, raw } = await validate(
    await req.formData(),
    z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().min(1, "Email is required").email("Email is invalid"),
    }),
  );

  if (!parsed.success) {
    return (
      <CreateContactsForm
        errors={parsed.error.flatten().fieldErrors}
        fields={raw}
      />
    );
  }
  await api.contact.create(parsed.data);
  return Response.redirect("/contacts");
});

router.route.DELETE("/contacts/:id", async (_req, params) => {
  if (!params.id) throw new Error("Something went wrong");
  await api.contact.delete(parseInt(params.id));
});
