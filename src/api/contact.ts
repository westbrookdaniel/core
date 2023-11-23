import { schema, db } from "~/db";
import { eq } from "drizzle-orm";

type CreateContactInput = Pick<schema.Contact, "name" | "email">;
type UpdateContactInput = Pick<schema.NewContact, "name" | "email">;

export const contact = {
  all: async () => {
    return db.query.contact.findMany();
  },
  one: async (id: number) => {
    return db.query.contact.findFirst({
      where: eq(schema.contact.id, id),
    });
  },
  create: async (input: CreateContactInput) => {
    const newContacts: schema.Contact[] = await db
      .insert(schema.contact)
      .values({ ...input, updatedAt: new Date() })
      .returning();
    return newContacts[0];
  },
  update: async (id: number, input: UpdateContactInput) => {
    const newContacts: schema.Contact[] = await db
      .update(schema.contact)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(schema.contact.id, id))
      .returning();
    return newContacts[0];
  },
  delete: async (id: number) => {
    await db.delete(schema.contact).where(eq(schema.contact.id, id));
    return { id };
  },
};
