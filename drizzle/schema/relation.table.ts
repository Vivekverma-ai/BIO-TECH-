import { relations } from "drizzle-orm";
import { users } from "./user.table";
import { businesses } from "./bussiness.table";
import { employees } from "./employee.table";
import { customers } from "./customer.table";

// User Relations
export const usersRelations = relations(users, ({ many }) => ({
  // A user can own multiple businesses
  ownedBusinesses: many(businesses),
  // A user can have employee profiles across businesses
  employeeProfiles: many(employees),
  // A user can have customer profiles across businesses
  customerProfiles: many(customers),
}));

// Business Relations
export const businessesRelations = relations(businesses, ({ one, many }) => ({
  // A business has one owner (User)
  owner: one(users, {
    fields: [businesses.ownerId],
    references: [users.id],
  }),
  // A business has many employees
  employees: many(employees),
  // A business has many customers
  customers: many(customers),
}));

// Employee Relations
export const employeesRelations = relations(employees, ({ one, many }) => ({
  // An employee record belongs to one user
  user: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  // An employee belongs to one business
  business: one(businesses, {
    fields: [employees.businessId],
    references: [businesses.id],
  }),
  // Self-referential relation: An employee can have a manager
  manager: one(employees, {
    fields: [employees.managerId],
    references: [employees.id],
    relationName: "manager_subordinates",
  }),
  // Self-referential relation: An employee (as a manager) can have direct reports
  subordinates: many(employees, {
    relationName: "manager_subordinates",
  }),
  // An employee can manage/be assigned to multiple customers
  assignedCustomers: many(customers),
}));

// Customer Relations
export const customersRelations = relations(customers, ({ one }) => ({
  // A customer belongs to one business
  business: one(businesses, {
    fields: [customers.businessId],
    references: [businesses.id],
  }),
  // A customer may optionally link to a registered user account
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  // A customer may be assigned to a specific account rep (Employee)
  assignedEmployee: one(employees, {
    fields: [customers.assignedEmployeeId],
    references: [employees.id],
  }),
}));
