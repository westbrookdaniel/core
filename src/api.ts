import { createApi } from "./core/createApi";
import { Contact, NewContact, contact, db, eq } from "./db";

type CreateContactInput = Pick<Contact, "name" | "email">;
type UpdateContactInput = Pick<NewContact, "name" | "email">;

export const api = createApi({
  contacts: {
    getAll: async () => db.query.contact.findMany(),
    getOne: async (id: number) => {
      return db.query.contact.findFirst({
        where: eq(contact.id, id),
      });
    },
    create: async (input: CreateContactInput) => {
      const newContacts: Contact[] = await db
        .insert(contact)
        .values({ ...input, updatedAt: new Date() })
        .returning();
      return newContacts[0];
    },
    update: async (id: number, input: UpdateContactInput) => {
      const newContacts: Contact[] = await db
        .update(contact)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(contact.id, id))
        .returning();
      return newContacts[0];
    },
    delete: async (id: number) => {
      await db.delete(contact).where(eq(contact.id, id));
      return { id };
    },
  },
});
