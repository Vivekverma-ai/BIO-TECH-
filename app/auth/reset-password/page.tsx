import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - BioTech Innovations Admin",
  description: "Reset your BioTech account password",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
