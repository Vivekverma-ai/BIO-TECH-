import { getSession } from "@/lib/session";
import { BusinessForm } from "./_components/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, MapPin, Globe, ArrowRight, ShieldCheck, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Profile - BioTech Admin",
  description: "View and update your laboratory enterprise profile and workspace settings",
};

export default async function BusinessPage() {
  const session = await getSession();
  const activeBusiness = session?.activeBusiness || null;
  const hasNoBusiness = !activeBusiness && (!session?.businesses || session.businesses.length === 0);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Onboarding Banner for Users without any business */}
      {hasNoBusiness ? (
        <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Step 1: Setup Your Business Workspace
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                Welcome, <span className="font-semibold text-foreground">{session?.user.name}</span>! Register your enterprise laboratory or biotech company to initialize your administrative workspace and access the dashboard.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Business Profile & Settings</h1>
            <p className="text-xs text-muted-foreground">
              View and manage operational parameters, legal credentials, and details for your business workspace
            </p>
          </div>
          <Button asChild size="sm" className="h-9 gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 shadow-sm">
            <Link href="/admin/dashboard">
              Go to Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      )}

      {/* Active Business Snapshot Card (GET mode) */}
      {activeBusiness && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold">{activeBusiness.name}</CardTitle>
                    <Badge
                      variant={activeBusiness.status === "active" ? "success" : "secondary"}
                      className="text-[10px] px-2 py-0.5 capitalize"
                    >
                      {activeBusiness.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    Workspace Identifier: /{activeBusiness.slug}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 border-t border-border/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 text-xs text-muted-foreground">
              <div>
                <span className="text-[11px] font-medium text-foreground block">Email</span>
                <span className="truncate">{activeBusiness.email || "Not specified"}</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-foreground block">Phone</span>
                <span className="truncate">{activeBusiness.phone || "Not specified"}</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-foreground block">Registration No.</span>
                <span className="font-mono truncate">{activeBusiness.registrationNumber || "N/A"}</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-foreground block">Registered Date</span>
                <span>{formatDate(activeBusiness.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Form (GET & UPDATE pre-filled form if existing, CREATE form if first time) */}
      <div>
        <BusinessForm business={activeBusiness} isOnboarding={hasNoBusiness} />
      </div>
    </div>
  );
}
