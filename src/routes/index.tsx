import { view, route, define } from "../core";
import { api } from "../api";
import { state } from "../state";
import { Layout } from "../layout";

const home = view("/", async () => {
  const { data: contacts } = await api.contacts.getAll();

  const errors = await state.home.errors.get();
  state.home.errors.remove();

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
          {errors.name ? <span class="red">{errors.name}</span> : null}
        </label>
        <label for="email">
          <input type="text" name="email" placeholder="Email" />
          {errors.email ? <span class="red">{errors.email}</span> : null}
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

const createContact = route("POST", "/p/contacts", async (req) => {
  const form = await req.formData();
  const name = form.get("name");
  const email = form.get("email");

  if (typeof name !== "string" || !name) {
    await state.home.errors.setKey("name", "Name is required");
  }
  if (typeof email !== "string" || !email) {
    await state.home.errors.setKey("email", "Email is required");
  }

  if (await state.home.errors.hasKeys()) return;

  await api.contacts.create({
    name: name as string,
    email: email as string,
  });
});

export default define({
  view: home,
  routes: [createContact],
});
