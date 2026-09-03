import * as React from "react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Route protection: If unauthenticated, redirect to signin
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Desktop Persistent Sidebar */}
      <AdminSidebar
        user={session.user}
        activeBusiness={session.activeBusiness}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Admin Navigation Header */}
        <AdminHeader
          user={session.user}
          businesses={session.businesses}
          activeBusiness={session.activeBusiness}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
