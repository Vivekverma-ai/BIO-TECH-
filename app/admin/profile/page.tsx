import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { User, Mail, Phone, ShieldCheck, KeyRound, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { PasswordForm } from "./_components/password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile - BioTech Admin",
  description: "Account credentials and security settings",
};

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  const user = session.user;
  const activeBusiness = session.activeBusiness;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Account Profile</h1>
        <p className="text-xs text-muted-foreground">
          Manage your credentials, roles, and enterprise security permissions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: User Overview Card */}
        <Card className="border-border shadow-xs bg-card md:col-span-1">
          <CardHeader className="text-center pb-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-md shadow-primary/20 mb-2">
              {user.name.charAt(0)}
            </div>
            <CardTitle className="text-base font-bold">{user.name}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground truncate">{user.email}</CardDescription>
            <div className="pt-2">
              <Badge variant="secondary" className="text-[10px] capitalize px-2">
                {user.role.replace("_", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-2 text-xs text-muted-foreground border-t border-border">
            <div className="flex items-center justify-between">
              <span>Account Status</span>
              <Badge variant="success" className="text-[10px] capitalize">
                {user.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Joined</span>
              <span className="font-medium text-foreground">{formatDate(user.createdAt)}</span>
            </div>
            {activeBusiness && (
              <div className="pt-2 border-t border-border/60">
                <p className="text-[11px] font-semibold text-foreground mb-1">Active Business:</p>
                <div className="flex items-center gap-1.5 text-primary">
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="font-medium truncate">{activeBusiness.name}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right 2 Cols: Details & Security Form */}
        <div className="space-y-6 md:col-span-2">
          {/* Identity Information */}
          <Card className="border-border shadow-xs bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary">
                <User className="h-4 w-4" />
                <CardTitle className="text-sm font-bold text-card-foreground">Identity & Contact Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px]">Full Name</span>
                  <p className="font-semibold text-foreground">{user.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px]">Email Address</span>
                  <p className="font-semibold text-foreground">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px]">Phone</span>
                  <p className="font-semibold text-foreground">{user.phone || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px]">Role Permission</span>
                  <p className="font-semibold text-foreground capitalize">{user.role.replace("_", " ")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Password Form */}
          <PasswordForm userEmail={user.email} />
        </div>
      </div>
    </div>
  );
}
