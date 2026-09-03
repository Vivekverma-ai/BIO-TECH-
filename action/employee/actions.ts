"use server";

import { db, employees, users } from "@/drizzle";
import { eq, desc, and, or, ilike, count } from "drizzle-orm";
import { getSession } from "@/lib/session";
import type {
  ActionResult,
  Employee,
  EmploymentStatus,
  EmploymentType,
  NewEmployee,
  PaginatedResult,
  PaginationParams,
  User,
} from "@/drizzle/type";
import { revalidatePath } from "next/cache";

export interface GetEmployeesFilter extends PaginationParams {
  employmentStatus?: EmploymentStatus | "all";
  employmentType?: EmploymentType | "all";
  department?: string | "all";
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  phone?: string;
  employeeCode?: string;
  jobTitle: string;
  department: string;
  employmentType?: EmploymentType;
  employmentStatus?: EmploymentStatus;
  salary?: string;
  notes?: string;
}

export interface UpdateEmployeeInput {
  name?: string;
  email?: string;
  phone?: string;
  employeeCode?: string;
  jobTitle?: string;
  department?: string;
  employmentType?: EmploymentType;
  employmentStatus?: EmploymentStatus;
  salary?: string;
  notes?: string;
}

export type EmployeeWithUserData = Employee & {
  user: User;
};

/**
 * Get paginated, searched, and filtered employees under the active business
 */
export async function getEmployeesAction(
  filter: GetEmployeesFilter = {}
): Promise<ActionResult<PaginatedResult<EmployeeWithUserData>>> {
  try {
    const session = await getSession();
    if (!session || !session.activeBusiness) {
      return { success: false, error: "No active business selected." };
    }

    const page = Math.max(1, Number(filter.page) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(filter.pageSize) || 10));
    const offset = (page - 1) * pageSize;

    const conditions = [eq(employees.businessId, session.activeBusiness.id)];

    // Filter by employment status
    if (filter.employmentStatus && filter.employmentStatus !== "all") {
      conditions.push(eq(employees.employmentStatus, filter.employmentStatus));
    }

    // Filter by employment type
    if (filter.employmentType && filter.employmentType !== "all") {
      conditions.push(eq(employees.employmentType, filter.employmentType));
    }

    // Filter by department
    if (filter.department && filter.department !== "all") {
      conditions.push(eq(employees.department, filter.department));
    }

    // Search query
    const search = filter.search?.trim();
    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(
        or(
          ilike(employees.jobTitle, searchPattern),
          ilike(employees.department, searchPattern),
          ilike(employees.employeeCode, searchPattern),
          ilike(users.name, searchPattern),
          ilike(users.email, searchPattern)
        )!
      );
    }

    const whereClause = and(...conditions);

    // Get total count
    const [totalCountResult] = await db
      .select({ value: count() })
      .from(employees)
      .leftJoin(users, eq(employees.userId, users.id))
      .where(whereClause);

    const total = Number(totalCountResult?.value || 0);
    const totalPages = Math.ceil(total / pageSize) || 1;

    // Fetch items with user relation
    const rawItems = await db
      .select({
        employee: employees,
        user: users,
      })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .where(whereClause)
      .orderBy(desc(employees.createdAt))
      .limit(pageSize)
      .offset(offset);

    const items: EmployeeWithUserData[] = rawItems.map((r) => ({
      ...r.employee,
      user: r.user,
    }));

    return {
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Get employees error:", error);
    return {
      success: false,
      error: "Failed to load employees.",
    };
  }
}

/**
 * Create a new employee under the active business
 */
export async function createEmployeeAction(
  input: CreateEmployeeInput
): Promise<ActionResult<{ employee: Employee }>> {
  try {
    const session = await getSession();
    if (!session || !session.activeBusiness) {
      return { success: false, error: "Active business is required to add employees." };
    }

    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();
    if (!email || !name || !input.jobTitle || !input.department) {
      return { success: false, error: "Name, email, job title, and department are required." };
    }

    // Find or create user account for the employee
    let employeeUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!employeeUser) {
      const [createdUser] = await db
        .insert(users)
        .values({
          name,
          email,
          phone: input.phone || null,
          role: "employee",
          status: "active",
        })
        .returning();
      employeeUser = createdUser;
    }

    const code = input.employeeCode?.trim() || `EMP-${Date.now().toString().slice(-4)}`;

    const newEmployeeData: NewEmployee = {
      businessId: session.activeBusiness.id,
      userId: employeeUser.id,
      employeeCode: code,
      jobTitle: input.jobTitle.trim(),
      department: input.department.trim(),
      employmentType: input.employmentType || "full_time",
      employmentStatus: input.employmentStatus || "active",
      salary: input.salary || null,
      notes: input.notes || null,
    };

    const [newEmployee] = await db
      .insert(employees)
      .values(newEmployeeData)
      .returning();

    revalidatePath("/admin/employee");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: { employee: newEmployee },
    };
  } catch (error) {
    console.error("Create employee error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create employee record.",
    };
  }
}

/**
 * Update an existing employee under the active business
 */
export async function updateEmployeeAction(
  employeeId: string,
  input: UpdateEmployeeInput
): Promise<ActionResult<{ employee: Employee }>> {
  try {
    const session = await getSession();
    if (!session || !session.activeBusiness) {
      return { success: false, error: "Active business required." };
    }

    const currentEmployee = await db.query.employees.findFirst({
      where: and(
        eq(employees.id, employeeId),
        eq(employees.businessId, session.activeBusiness.id)
      ),
    });

    if (!currentEmployee) {
      return { success: false, error: "Employee record not found." };
    }

    // Update user record if name/email/phone provided
    if (input.name || input.email || input.phone !== undefined) {
      await db
        .update(users)
        .set({
          ...(input.name ? { name: input.name.trim() } : {}),
          ...(input.email ? { email: input.email.trim().toLowerCase() } : {}),
          phone: input.phone || null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, currentEmployee.userId));
    }

    // Update employee record
    const [updatedEmployee] = await db
      .update(employees)
      .set({
        ...(input.jobTitle ? { jobTitle: input.jobTitle.trim() } : {}),
        ...(input.department ? { department: input.department.trim() } : {}),
        ...(input.employeeCode ? { employeeCode: input.employeeCode.trim() } : {}),
        ...(input.employmentType ? { employmentType: input.employmentType } : {}),
        ...(input.employmentStatus ? { employmentStatus: input.employmentStatus } : {}),
        salary: input.salary || null,
        notes: input.notes || null,
        updatedAt: new Date(),
      })
      .where(eq(employees.id, employeeId))
      .returning();

    revalidatePath("/admin/employee");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: { employee: updatedEmployee },
    };
  } catch (error) {
    console.error("Update employee error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update employee.",
    };
  }
}
