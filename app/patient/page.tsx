import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getSession();

  // 1. If not logged in -> redirect to signin page
  if (!session) {
    redirect("/auth/signin");
  }

  // 2. If logged in and does not have a business id / workspace -> redirect to business create page
  if (!session.activeBusiness && session.businesses.length === 0) {
    redirect("/admin/business");
  }

  // 3. If logged in and has business id -> redirect to dashboard
  redirect("/admin/dashboard");
}
