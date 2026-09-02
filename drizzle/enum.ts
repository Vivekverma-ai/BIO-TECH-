import { pgEnum } from "drizzle-orm/pg-core";

/**
 * ============================================================================
 * 1. USER ENUMS
 * ============================================================================
 */

export const USER_ROLES = [
  "super_admin",
  "business_owner",
  "employee",
  "customer",
  "user",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const userRoleEnum = pgEnum("user_role", USER_ROLES);

export const USER_STATUSES = [
  "active",
  "inactive",
  "pending",
  "suspended",
] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export const userStatusEnum = pgEnum("user_status", USER_STATUSES);

/**
 * ============================================================================
 * 2. BUSINESS ENUMS
 * ============================================================================
 */

export const BUSINESS_STATUSES = [
  "active",
  "inactive",
  "pending_verification",
  "suspended",
] as const;

export type BusinessStatus = (typeof BUSINESS_STATUSES)[number];

export const businessStatusEnum = pgEnum("business_status", BUSINESS_STATUSES);

/**
 * ============================================================================
 * 3. EMPLOYEE ENUMS
 * ============================================================================
 */

export const EMPLOYMENT_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "intern",
] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const employmentTypeEnum = pgEnum("employment_type", EMPLOYMENT_TYPES);

export const EMPLOYMENT_STATUSES = [
  "active",
  "on_leave",
  "terminated",
  "resigned",
] as const;

export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];

export const employmentStatusEnum = pgEnum("employment_status", EMPLOYMENT_STATUSES);

/**
 * ============================================================================
 * 4. CUSTOMER ENUMS
 * ============================================================================
 */

export const CUSTOMER_TYPES = [
  "individual",
  "corporate",
  "research_institution",
  "hospital",
  "government",
] as const;

export type CustomerType = (typeof CUSTOMER_TYPES)[number];

export const customerTypeEnum = pgEnum("customer_type", CUSTOMER_TYPES);

export const CUSTOMER_STATUSES = [
  "lead",
  "active",
  "inactive",
  "churned",
  "archived",
] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const customerStatusEnum = pgEnum("customer_status", CUSTOMER_STATUSES);
