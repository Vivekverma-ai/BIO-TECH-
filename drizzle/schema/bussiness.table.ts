import { pgTable, uuid, varchar, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { businessStatusEnum } from "../enum";
import { users } from "./user.table";

// Businesses Table Definition
export const businesses = pgTable("businesses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 255 }),
  address: text("address"),
  logoUrl: text("logo_url"),
  registrationNumber: varchar("registration_number", { length: 100 }),
  taxId: varchar("tax_id", { length: 100 }),
  ownerId: uuid("owner_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  status: businessStatusEnum("status").default("active").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
