import { view, route, define, z } from "../core";
import { api } from "../api";
import { newObjectState } from "../state";
import { Layout } from "../layout";

type FieldErrors = Record<string, string[] | undefined>;
const fieldErrors = newObjectState<FieldErrors>("home:errors", { default: {} });

const home = view("/", async () => {
  const { data: contacts } = await api.contacts.getAll();

  const errors = await fieldErrors.get();
  fieldErrors.remove();

  if (!contacts) throw new Error("Contacts not found");

  return (
    <Layout>
      <h1>Contacts</h1>
      <form
        action="/p/contacts"
        method="POST"
        style="display: flex; flex-direction: column; align-items: flex-start;"
      >
        <label for="name">
          <input type="text" name="name" placeholder="Name" />
          {errors.name ? (
            <span class="red">{errors.name.join(", ")}</span>
          ) : null}
        </label>
        <label for="email">
          <input type="text" name="email" placeholder="Email" />
          {errors.email ? (
            <span class="red">{errors.email.join(", ")}</span>
          ) : null}
        </label>
        <button type="submit">Add</button>
      </form>
      <ul>
        {contacts.map((contact) => (
          <li>
            <p>
              {contact.name}: {contact.email}
            </p>
          </li>
        ))}
      </ul>
    </Layout>
  );
});

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

const createContact = route("POST", "/p/contacts", async (req) => {
  const form = Object.fromEntries(await req.formData());
  const opt = formSchema.safeParse(form);

  if (!opt.success) {
    return await fieldErrors.set(opt.error.flatten().fieldErrors);
  }

  await api.contacts.create(opt.data);
});

export default define({
  view: home,
  routes: [createContact],
});
