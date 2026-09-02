import { pgTable, uuid, varchar, text, timestamp, numeric, jsonb, type AnyPgColumn } from "drizzle-orm/pg-core";
import { employmentTypeEnum, employmentStatusEnum } from "../enum";
import { businesses } from "./bussiness.table";
import { users } from "./user.table";

// Employees Table Definition
export const employees = pgTable("employees", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessId: uuid("business_id")
    .references(() => businesses.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  employeeCode: varchar("employee_code", { length: 100 }),
  jobTitle: varchar("job_title", { length: 255 }),
  department: varchar("department", { length: 255 }),
  employmentType: employmentTypeEnum("employment_type").default("full_time"),
  employmentStatus: employmentStatusEnum("employment_status").default("active"),
  salary: numeric("salary", { precision: 12, scale: 2 }),
  hireDate: timestamp("hire_date", { withTimezone: true }),
  terminationDate: timestamp("termination_date", { withTimezone: true }),
  managerId: uuid("manager_id").references((): AnyPgColumn => employees.id, { onDelete: "set null" }),
  notes: text("notes"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
