import { SignUpForm } from "@/components/auth/sign-up-form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - BioTech Innovations Admin",
  description: "Create a new BioTech enterprise account",
};

export default async function SignUpPage() {
  const session = await getSession();

  if (session) {
    if (session.businesses.length > 0 || session.activeBusiness) {
      redirect("/admin/dashboard");
    } else {
      redirect("/admin/business");
    }
  }

  return <SignUpForm />;
}
