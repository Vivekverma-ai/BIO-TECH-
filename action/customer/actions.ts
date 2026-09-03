"use server";

import { db, customers } from "@/drizzle";
import { eq, desc, and, or, ilike, count } from "drizzle-orm";
import { getSession } from "@/lib/session";
import type {
  ActionResult,
  Customer,
  CustomerStatus,
  CustomerType,
  NewCustomer,
  PaginatedResult,
  PaginationParams,
} from "@/drizzle/type";
import { revalidatePath } from "next/cache";

export interface GetCustomersFilter extends PaginationParams {
  status?: CustomerStatus | "all";
  type?: CustomerType | "all";
}

export interface CreateCustomerInput {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  customerType?: CustomerType;
  status?: CustomerStatus;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateCustomerInput {
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  customerType?: CustomerType;
  status?: CustomerStatus;
  notes?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Get paginated, searched, and filtered customers under the active business
 */
export async function getCustomersAction(
  filter: GetCustomersFilter = {}
): Promise<ActionResult<PaginatedResult<Customer>>> {
  try {
    const session = await getSession();
    if (!session || !session.activeBusiness) {
      return { success: false, error: "No active business selected." };
    }

    const page = Math.max(1, Number(filter.page) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(filter.pageSize) || 10));
    const offset = (page - 1) * pageSize;

    const conditions = [eq(customers.businessId, session.activeBusiness.id)];

    // Filter by status
    if (filter.status && filter.status !== "all") {
      conditions.push(eq(customers.status, filter.status));
    }

    // Filter by type
    if (filter.type && filter.type !== "all") {
      conditions.push(eq(customers.type, filter.type));
    }

    // Search query
    const search = filter.search?.trim();
    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(
        or(
          ilike(customers.name, searchPattern),
          ilike(customers.email, searchPattern),
          ilike(customers.companyName, searchPattern),
          ilike(customers.phone, searchPattern)
        )!
      );
    }

    const whereClause = and(...conditions);

    // Get total count
    const [totalCountResult] = await db
      .select({ value: count() })
      .from(customers)
      .where(whereClause);

    const total = Number(totalCountResult?.value || 0);
    const totalPages = Math.ceil(total / pageSize) || 1;

    // Fetch items with pagination
    const items = await db.query.customers.findMany({
      where: whereClause,
      orderBy: [desc(customers.createdAt)],
      limit: pageSize,
      offset: offset,
    });

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
    console.error("Get customers error:", error);
    return {
      success: false,
      error: "Failed to load customers.",
    };
  }
}

/**
 * Create a new customer under the active business
 */
export async function createCustomerAction(
  input: CreateCustomerInput
): Promise<ActionResult<{ customer: Customer }>> {
  try {
    const session = await getSession();
    if (!session || !session.activeBusiness) {
      return { success: false, error: "Active business is required to add customers." };
    }

    const name = input.name?.trim();
    if (!name) {
      return { success: false, error: "Customer name is required." };
    }

    const newCustomerData: NewCustomer = {
      name,
      businessId: session.activeBusiness.id,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      companyName: input.companyName?.trim() || null,
      type: input.customerType || "corporate",
      status: input.status || "active",
      notes: input.notes?.trim() || null,
      metadata: input.metadata || {},
    };

    const [newCustomer] = await db
      .insert(customers)
      .values(newCustomerData)
      .returning();

    revalidatePath("/admin/customer");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: { customer: newCustomer },
    };
  } catch (error) {
    console.error("Create customer error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create customer.",
    };
  }
}

/**
 * Update an existing customer record under the active business
 */
export async function updateCustomerAction(
  customerId: string,
  input: UpdateCustomerInput
): Promise<ActionResult<{ customer: Customer }>> {
  try {
    const session = await getSession();
    if (!session || !session.activeBusiness) {
      return { success: false, error: "Active business required." };
    }

    const name = input.name?.trim();
    if (!name) {
      return { success: false, error: "Customer name is required." };
    }

    const [updated] = await db
      .update(customers)
      .set({
        name,
        email: input.email?.trim() || null,
        phone: input.phone?.trim() || null,
        companyName: input.companyName?.trim() || null,
        type: input.customerType || "corporate",
        status: input.status || "active",
        notes: input.notes?.trim() || null,
        metadata: input.metadata || {},
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(customers.id, customerId),
          eq(customers.businessId, session.activeBusiness.id)
        )
      )
      .returning();

    if (!updated) {
      return { success: false, error: "Customer record not found or permission denied." };
    }

    revalidatePath("/admin/customer");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: { customer: updated },
    };
  } catch (error) {
    console.error("Update customer error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update customer.",
    };
  }
}
