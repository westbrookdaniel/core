interface Props {
  fields?: {
    email?: string;
    name?: string;
  };
  errors?: {
    email?: string[];
    name?: string[];
  };
}

export function CreateContactsForm({ fields = {}, errors = {} }: Props) {
  return (
    <form
      hx-post="/contacts"
      hx-swap="outerHTML"
      class="flex flex-col text-left"
      novalidate
    >
      <label for="name" class="mb-4">
        Name
        <input
          type="text"
          name="name"
          value={fields.name}
          class="block w-full border border-neutral-700 bg-neutral-800 py-2 my-1 px-4 rounded-full"
        />
        {!!errors.name?.length && (
          <span class="text-red-500">{errors.name[0]}</span>
        )}
      </label>
      <label for="email" class="mb-4">
        Email
        <input
          type="email"
          name="email"
          value={fields.email}
          class="block w-full border border-neutral-700 bg-neutral-800 py-2 my-1 px-4 rounded-full"
        />
        {!!errors.email?.length && (
          <span class="text-red-500">{errors.email[0]}</span>
        )}
      </label>
      <button class="bg-neutral-700 py-2 px-4 rounded-full hover:bg-neutral-600 focus:bg-neutral-500">
        Create Contact
      </button>
    </form>
  );
}
