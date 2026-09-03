import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db, users, businesses, employees } from "@/drizzle";
import { eq, inArray } from "drizzle-orm";
import type { AuthSession, SessionPayload, Business, User } from "@/drizzle/type";

const SESSION_COOKIE_NAME = "biotech_session";
const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "biotech-innovations-secure-jwt-super-secret-key-32chars"
);
const SESSION_EXPIRATION = "7d";

/**
 * Sign session payload into an encrypted/signed JWT
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(SESSION_SECRET);
}

/**
 * Verify and decode JWT token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Get the current session payload from cookies
 */
export async function getSessionPayload(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return null;
  return verifySessionToken(sessionToken);
}

/**
 * Get full hydrated AuthSession from database (User, Active Business, and All User Businesses)
 */
export async function getSession(): Promise<AuthSession | null> {
  try {
    const payload = await getSessionPayload();
    if (!payload?.userId) return null;

    // Fetch user from DB
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.userId),
    });

    if (!user || user.status === "suspended" || user.status === "inactive") {
      return null;
    }

    // Fetch businesses where user is owner
    const ownedBusinesses = await db.query.businesses.findMany({
      where: eq(businesses.ownerId, user.id),
      orderBy: (b, { desc }) => [desc(b.createdAt)],
    });

    // Also fetch businesses where user is an employee
    const employeeRecords = await db.query.employees.findMany({
      where: eq(employees.userId, user.id),
    });

    const employeeBusinessIds = employeeRecords.map((e) => e.businessId);
    let memberBusinesses: Business[] = [];
    if (employeeBusinessIds.length > 0) {
      memberBusinesses = await db.query.businesses.findMany({
        where: inArray(businesses.id, employeeBusinessIds),
      });
    }

    // Combine distinct businesses
    const allBusinessesMap = new Map<string, Business>();
    [...ownedBusinesses, ...memberBusinesses].forEach((b) => {
      allBusinessesMap.set(b.id, b);
    });
    const userBusinesses = Array.from(allBusinessesMap.values());

    // Resolve active business
    let activeBusiness: Business | null = null;
    if (payload.activeBusinessId) {
      activeBusiness = userBusinesses.find((b) => b.id === payload.activeBusinessId) || null;
    }

    // Fallback to first business if no active business set or invalid
    if (!activeBusiness && userBusinesses.length > 0) {
      activeBusiness = userBusinesses[0];
    }

    return {
      user,
      activeBusiness,
      businesses: userBusinesses,
    };
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
}

/**
 * Create a new user session cookie
 */
export async function createSession(user: User, activeBusinessId?: string | null): Promise<void> {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    activeBusinessId: activeBusinessId || null,
  };

  const token = await signSessionToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Switch active business for the current logged in session
 */
export async function setActiveBusinessId(businessId: string): Promise<boolean> {
  const payload = await getSessionPayload();
  if (!payload?.userId) return false;

  const cookieStore = await cookies();
  const updatedPayload: SessionPayload = {
    ...payload,
    activeBusinessId: businessId,
  };

  const token = await signSessionToken(updatedPayload);
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return true;
}

/**
 * Destroy current session cookie (Sign Out)
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
