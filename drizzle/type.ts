import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { users } from "./schema/user.table";
import { businesses } from "./schema/bussiness.table";
import { employees } from "./schema/employee.table";
import { customers } from "./schema/customer.table";

// Re-export all enum types and constants for centralized access
export * from "./enum";

/**
 * ============================================================================
 * 1. DATABASE INFERRED TABLE TYPES
 * ============================================================================
 */

// User Models
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type UserUpdate = Partial<Omit<NewUser, "id">>;

// Business Models
export type Business = InferSelectModel<typeof businesses>;
export type NewBusiness = InferInsertModel<typeof businesses>;
export type BusinessUpdate = Partial<Omit<NewBusiness, "id">>;

// Employee Models
export type Employee = InferSelectModel<typeof employees>;
export type NewEmployee = InferInsertModel<typeof employees>;
export type EmployeeUpdate = Partial<Omit<NewEmployee, "id">>;

// Customer Models
export type Customer = InferSelectModel<typeof customers>;
export type NewCustomer = InferInsertModel<typeof customers>;
export type CustomerUpdate = Partial<Omit<NewCustomer, "id">>;

/**
 * ============================================================================
 * 2. RELATIONAL / COMPOSITE TYPES (HYDRATED QUERIES)
 * ============================================================================
 */

// Employee with User details & optional Manager
export type EmployeeWithUser = Employee & {
  user: User;
};

export type EmployeeWithDetails = Employee & {
  user: User;
  business: Business;
  manager: (Employee & { user: User }) | null;
};

// Customer with Business, User, and assigned Employee
export type CustomerWithDetails = Customer & {
  business: Business;
  user: User | null;
  assignedEmployee: (Employee & { user: User }) | null;
};

// Business with Owner, nested Employees & Customers
export type BusinessWithOwner = Business & {
  owner: User;
};

export type BusinessWithAllDetails = Business & {
  owner: User;
  employees: (Employee & {
    user: User;
    manager: (Employee & { user: User }) | null;
  })[];
  customers?: Customer[];
};

// User with owned businesses, employee profiles & customer profiles
export type UserWithRelations = User & {
  ownedBusinesses: Business[];
  employeeProfiles: (Employee & {
    business: Business;
  })[];
  customerProfiles: (Customer & {
    business: Business;
  })[];
};

/**
 * ============================================================================
 * 3. AUTHENTICATION & SESSION TYPES
 * ============================================================================
 */

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  activeBusinessId?: string | null;
}

export interface AuthSession {
  user: User;
  activeBusiness: Business | null;
  businesses: Business[];
}

/**
 * ============================================================================
 * 4. PAGINATION & FILTER TYPES
 * ============================================================================
 */

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * ============================================================================
 * 5. COMMON API & SERVER ACTION RESULT TYPES
 * ============================================================================
 */

export type ActionResult<T = unknown> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: T };
