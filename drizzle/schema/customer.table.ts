import { pgTable, uuid, varchar, text, timestamp, numeric, jsonb, type AnyPgColumn } from "drizzle-orm/pg-core";
import { customerTypeEnum, customerStatusEnum } from "../enum";
import { businesses } from "./bussiness.table";
import { users } from "./user.table";
import { employees } from "./employee.table";

// Customers Table Definition
export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .references(() => businesses.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "set null" }),
  assignedEmployeeId: uuid("assigned_employee_id")
    .references((): AnyPgColumn => employees.id, { onDelete: "set null" }),
  customerCode: varchar("customer_code", { length: 100 }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  companyName: varchar("company_name", { length: 255 }),
  type: customerTypeEnum("type").default("individual").notNull(),
  status: customerStatusEnum("status").default("lead").notNull(),
  taxId: varchar("tax_id", { length: 100 }),
  creditLimit: numeric("credit_limit", { precision: 12, scale: 2 }),
  billingAddress: text("billing_address"),
  shippingAddress: text("shipping_address"),
  notes: text("notes"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
