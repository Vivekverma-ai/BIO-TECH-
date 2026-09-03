import { SignInForm } from "@/components/auth/sign-in-form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - BioTech Innovations Admin",
  description: "Sign in to access your laboratory enterprise portal and workspace",
};

export default async function SignInPage() {
  const session = await getSession();

  // If already logged in, redirect based on business existence
  if (session) {
    if (session.businesses.length > 0 || session.activeBusiness) {
      redirect("/admin/dashboard");
    } else {
      redirect("/admin/business");
    }
  }

  return <SignInForm />;
}
