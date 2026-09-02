import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { userRoleEnum, userStatusEnum } from "../enum";

// Users Table Definition
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  role: userRoleEnum("role").default("user").notNull(),
  status: userStatusEnum("status").default("active").notNull(),
  avatarUrl: text("avatar_url"),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
