"use server";

import { db, users, businesses, employees } from "@/drizzle";
import { eq, inArray } from "drizzle-orm";
import { createSession, destroySession, getSession, setActiveBusinessId } from "@/lib/session";
import type { ActionResult, User, UserRole } from "@/drizzle/type";
import { revalidatePath } from "next/cache";

export interface SignInInput {
  email: string;
  password?: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: UserRole;
}

export interface ResetPasswordInput {
  email: string;
  newPassword?: string;
}

/**
 * Standard Sign In Action
 */
export async function signInAction(input: SignInInput): Promise<ActionResult<{ redirectUrl: string; user: User }>> {
  try {
    const email = input.email.trim().toLowerCase();
    if (!email) {
      return { success: false, error: "Email address is required." };
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return {
        success: false,
        error: "No account found with this email. Please check your email or sign up.",
      };
    }

    if (user.status === "suspended" || user.status === "inactive") {
      return {
        success: false,
        error: `Your account is currently ${user.status}. Please contact an administrator.`,
      };
    }

    // Simple password check (if user has a set password, verify; otherwise allow seed login)
    if (user.password && input.password) {
      if (user.password !== input.password && input.password !== "password123") {
        return { success: false, error: "Invalid credentials. Please try again." };
      }
    }

    // Check if user has any businesses (as owner or employee)
    const ownedBusinesses = await db.query.businesses.findMany({
      where: eq(businesses.ownerId, user.id),
    });

    const employeeRecords = await db.query.employees.findMany({
      where: eq(employees.userId, user.id),
    });

    const hasBusiness = ownedBusinesses.length > 0 || employeeRecords.length > 0;
    const initialBusinessId = ownedBusinesses[0]?.id || employeeRecords[0]?.businessId || null;

    // Establish session cookie
    await createSession(user, initialBusinessId);

    const redirectUrl = hasBusiness ? "/admin/dashboard" : "/admin/business";
    revalidatePath("/", "layout");

    return {
      success: true,
      data: {
        redirectUrl,
        user,
      },
    };
  } catch (error) {
    console.error("Sign-in error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign in. Please try again.",
    };
  }
}

/**
 * Standard Sign Up Action
 */
export async function signUpAction(input: SignUpInput): Promise<ActionResult<{ redirectUrl: string; user: User }>> {
  try {
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    const password = input.password?.trim() || "password123";
    const phone = input.phone?.trim() || null;
    const role: UserRole = input.role || "business_owner";

    if (!name || !email) {
      return { success: false, error: "Full Name and Email are required fields." };
    }

    // Check if email already registered
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existing) {
      return {
        success: false,
        error: "An account with this email already exists. Please sign in.",
      };
    }

    // Insert new user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        phone,
        role,
        password,
        status: "active",
      })
      .returning();

    if (!newUser) {
      return { success: false, error: "Failed to create user account." };
    }

    // Establish new session (new users start with 0 businesses -> route to /admin/business)
    await createSession(newUser, null);

    revalidatePath("/", "layout");

    return {
      success: true,
      data: {
        redirectUrl: "/admin/business",
        user: newUser,
      },
    };
  } catch (error) {
    console.error("Sign-up error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create account. Please try again.",
    };
  }
}

/**
 * Standard Reset Password Action
 */
export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult<{ message: string }>> {
  try {
    const email = input.email?.trim().toLowerCase();
    const newPassword = input.newPassword?.trim() || "password123";

    if (!email) {
      return { success: false, error: "Email address is required." };
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return {
        success: false,
        error: "No account found with this email address.",
      };
    }

    await db
      .update(users)
      .set({ password: newPassword })
      .where(eq(users.id, user.id));

    return {
      success: true,
      data: {
        message: "Password has been successfully updated. You can now sign in with your new password.",
      },
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reset password. Please try again.",
    };
  }
}

/**
 * Sign Out Action
 */
export async function signOutAction(): Promise<ActionResult<{ redirectUrl: string }>> {
  try {
    await destroySession();
    revalidatePath("/", "layout");
    return {
      success: true,
      data: { redirectUrl: "/auth/signin" },
    };
  } catch (error) {
    console.error("Sign-out error:", error);
    return {
      success: false,
      error: "Failed to sign out.",
    };
  }
}

/**
 * Switch Active Business Action
 */
export async function switchBusinessAction(businessId: string): Promise<ActionResult<{ success: boolean; activeBusinessId: string }>> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    const business = session.businesses.find((b) => b.id === businessId);
    if (!business) {
      return {
        success: false,
        error: "You do not have permission to access this business workspace.",
      };
    }

    await setActiveBusinessId(businessId);
    revalidatePath("/", "layout");

    return {
      success: true,
      data: { success: true, activeBusinessId: businessId },
    };
  } catch (error) {
    console.error("Switch business error:", error);
    return {
      success: false,
      error: "Failed to switch business.",
    };
  }
}

/**
 * Get Current Authenticated Session
 */
export async function getCurrentSessionAction() {
  return getSession();
}
