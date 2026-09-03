"use server";

import { db, businesses } from "@/drizzle";
import { eq } from "drizzle-orm";
import { getSession, setActiveBusinessId } from "@/lib/session";
import type { ActionResult, Business, BusinessStatus, NewBusiness } from "@/drizzle/type";
import { revalidatePath } from "next/cache";

export interface CreateBusinessInput {
  name: string;
  slug?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  registrationNumber?: string;
  taxId?: string;
  status?: BusinessStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateBusinessInput {
  name?: string;
  slug?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  registrationNumber?: string;
  taxId?: string;
  status?: BusinessStatus;
  metadata?: Record<string, unknown>;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "") || `business-${Date.now()}`;
}

/**
 * Create a new Business under the current authenticated user (One user can only create one business)
 */
export async function createBusinessAction(
  input: CreateBusinessInput
): Promise<ActionResult<{ redirectUrl: string; business: Business }>> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized. Please sign in to create a business." };
    }

    // Enforce 1 person = 1 business rule
    const existingUserBusiness = await db.query.businesses.findFirst({
      where: eq(businesses.ownerId, session.user.id),
    });

    if (existingUserBusiness) {
      // User already has a business -> set active and redirect to dashboard
      await setActiveBusinessId(existingUserBusiness.id);
      return {
        success: true,
        data: {
          redirectUrl: "/admin/dashboard",
          business: existingUserBusiness,
        },
      };
    }

    const name = input.name?.trim();
    if (!name) {
      return { success: false, error: "Business name is required." };
    }

    let slug = input.slug?.trim() ? slugify(input.slug) : slugify(name);

    // Check if slug is unique
    const existingSlug = await db.query.businesses.findFirst({
      where: eq(businesses.slug, slug),
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newBusinessData: NewBusiness = {
      name,
      slug,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      website: input.website?.trim() || null,
      address: input.address?.trim() || null,
      registrationNumber: input.registrationNumber?.trim() || null,
      taxId: input.taxId?.trim() || null,
      ownerId: session.user.id,
      status: input.status || "active",
      metadata: input.metadata || {
        industry: "Biotechnology & Healthcare",
        setupCompleted: true,
      },
    };

    const [createdBusiness] = await db
      .insert(businesses)
      .values(newBusinessData)
      .returning();

    if (!createdBusiness) {
      return { success: false, error: "Failed to create business record." };
    }

    // Set this newly created business as the active business
    await setActiveBusinessId(createdBusiness.id);

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/business");

    return {
      success: true,
      data: {
        redirectUrl: "/admin/dashboard",
        business: createdBusiness,
      },
    };
  } catch (error) {
    console.error("Create business error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create business.",
    };
  }
}

/**
 * Get the business associated with the authenticated user
 */
export async function getUserBusinessesAction(): Promise<
  ActionResult<{ business: Business | null }>
> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized." };
    }

    return {
      success: true,
      data: {
        business: session.activeBusiness,
      },
    };
  } catch (error) {
    console.error("Get business error:", error);
    return {
      success: false,
      error: "Failed to fetch user business.",
    };
  }
}

/**
 * Get detailed business information by ID
 */
export async function getBusinessByIdAction(
  businessId: string
): Promise<ActionResult<{ business: Business }>> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized." };
    }

    const business = await db.query.businesses.findFirst({
      where: eq(businesses.id, businessId),
      with: {
        owner: true,
        employees: {
          with: {
            user: true,
          },
        },
        customers: true,
      },
    });

    if (!business) {
      return { success: false, error: "Business not found." };
    }

    return {
      success: true,
      data: { business },
    };
  } catch (error) {
    console.error("Get business by id error:", error);
    return {
      success: false,
      error: "Failed to load business details.",
    };
  }
}

/**
 * Update Business details (GET & UPDATE only, no DELETE)
 */
export async function updateBusinessAction(
  businessId: string,
  input: UpdateBusinessInput
): Promise<ActionResult<{ business: Business; message: string }>> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized." };
    }

    // Ensure user owns or is associated with this business
    if (session.activeBusiness?.id !== businessId && !session.businesses.some((b) => b.id === businessId)) {
      return { success: false, error: "Permission denied." };
    }

    const name = input.name?.trim();
    if (!name) {
      return { success: false, error: "Business name is required." };
    }

    let slug = input.slug?.trim() ? slugify(input.slug) : undefined;

    // Check slug uniqueness if changed
    if (slug) {
      const existingSlug = await db.query.businesses.findFirst({
        where: eq(businesses.slug, slug),
      });

      if (existingSlug && existingSlug.id !== businessId) {
        return { success: false, error: "This workspace slug is already in use. Please choose another." };
      }
    }

    const [updatedBusiness] = await db
      .update(businesses)
      .set({
        name,
        ...(slug ? { slug } : {}),
        email: input.email?.trim() || null,
        phone: input.phone?.trim() || null,
        website: input.website?.trim() || null,
        address: input.address?.trim() || null,
        registrationNumber: input.registrationNumber?.trim() || null,
        taxId: input.taxId?.trim() || null,
        status: input.status || "active",
        metadata: input.metadata || {},
        updatedAt: new Date(),
      })
      .where(eq(businesses.id, businessId))
      .returning();

    if (!updatedBusiness) {
      return { success: false, error: "Business record could not be updated." };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/admin/business");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: {
        business: updatedBusiness,
        message: "Business profile updated successfully!",
      },
    };
  } catch (error) {
    console.error("Update business error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update business.",
    };
  }
}
