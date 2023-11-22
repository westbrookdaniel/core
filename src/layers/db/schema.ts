import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const contact = pgTable("contact", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Contact = typeof contact.$inferSelect;
export type NewContact = typeof contact.$inferInsert;
