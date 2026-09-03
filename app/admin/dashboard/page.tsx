import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db, customers, employees } from "@/drizzle";
import { eq, desc } from "drizzle-orm";
import {
  Building2,
  Users,
  UserCheck,
  Activity,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Plus,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - BioTech Innovations Admin",
  description: "Enterprise laboratory metrics, customers, and team operations",
};

export default async function DashboardPage() {
  const session = await getSession();

  // If user has no active business, route them to business creation/selection
  if (!session || !session.activeBusiness) {
    redirect("/admin/business");
  }

  const activeBusiness = session.activeBusiness;

  // Fetch actual metrics from database for this active business
  const businessCustomers = await db.query.customers.findMany({
    where: eq(customers.businessId, activeBusiness.id),
    orderBy: [desc(customers.createdAt)],
    limit: 5,
  });

  const businessEmployees = await db.query.employees.findMany({
    where: eq(employees.businessId, activeBusiness.id),
    with: {
      user: true,
    },
    orderBy: [desc(employees.createdAt)],
    limit: 5,
  });

  const totalCustomersCount = businessCustomers.length;
  const totalEmployeesCount = businessEmployees.length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Active Business Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {activeBusiness.name}
                  </h1>
                  <Badge
                    variant={activeBusiness.status === "active" ? "success" : "secondary"}
                    className="text-[10px] capitalize px-2 py-0.5"
                  >
                    {activeBusiness.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>Workspace ID: /{activeBusiness.slug}</span>
                  {activeBusiness.registrationNumber && (
                    <span>• Reg: {activeBusiness.registrationNumber}</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
              <Link href="/admin/business">
                <Building2 className="h-3.5 w-3.5" />
                Manage Profile
              </Link>
            </Button>
            <Button asChild size="sm" className="h-9 gap-1.5 text-xs shadow-sm">
              <Link href="/admin/customer">
                <Plus className="h-3.5 w-3.5" />
                Add Customer
              </Link>
            </Button>
          </div>
        </div>

        {/* Business details snippet */}
        {(activeBusiness.email || activeBusiness.phone || activeBusiness.address) && (
          <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {activeBusiness.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>{activeBusiness.email}</span>
              </div>
            )}
            {activeBusiness.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                <span>{activeBusiness.phone}</span>
              </div>
            )}
            {activeBusiness.address && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-amber-600" />
                <span>{activeBusiness.address}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4 Metric Cards (Shadcn Block Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Customers */}
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Active Customer Accounts
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1 pt-0">
            <div className="text-2xl font-bold tracking-tight">{totalCustomersCount}</div>
            <div className="flex items-center text-[11px] text-muted-foreground gap-1">
              <span className="text-emerald-600 font-semibold flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +14.2%
              </span>
              <span>vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Employees */}
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Laboratory & Staff Members
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1 pt-0">
            <div className="text-2xl font-bold tracking-tight">{totalEmployeesCount}</div>
            <div className="flex items-center text-[11px] text-muted-foreground gap-1">
              <span className="text-emerald-600 font-semibold">100% active</span>
              <span>personnel assigned</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Pipeline Operations */}
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Assay & Sequencing Pipeline
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1 pt-0">
            <div className="text-2xl font-bold tracking-tight">1,482 Samples</div>
            <div className="flex items-center text-[11px] text-muted-foreground gap-1">
              <span className="text-emerald-600 font-semibold flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +8.5%
              </span>
              <span>throughput rate</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Compliance & ISO */}
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              GLP / ISO Compliance Score
            </CardTitle>
            <div className="h-7 w-7 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1 pt-0">
            <div className="text-2xl font-bold tracking-tight">99.8%</div>
            <div className="flex items-center text-[11px] text-muted-foreground gap-1">
              <span className="text-primary font-semibold">Verified</span>
              <span>Audit trails synced</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Customers & Recent Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Customer Relationships */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border shadow-xs bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold">Recent Customers & Partners</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Clinical institutions, hospitals, and corporate research partners
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                <Link href="/admin/customer">
                  View All
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {businessCustomers.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Users className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-xs font-medium text-foreground">No customer records yet</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Register clinical trials or research partners for this workspace
                  </p>
                  <div className="mt-3">
                    <Button asChild size="sm" className="h-8 text-xs">
                      <Link href="/admin/customer">Add First Customer</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-semibold">Customer / Entity</TableHead>
                      <TableHead className="text-xs font-semibold">Type</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                      <TableHead className="text-xs font-semibold">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {businessCustomers.map((cust) => (
                      <TableRow key={cust.id} className="text-xs">
                        <TableCell>
                          <div className="font-semibold text-foreground">{cust.name}</div>
                          <div className="text-[11px] text-muted-foreground">{cust.email || cust.companyName || "No contact"}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {cust.type.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={cust.status === "active" ? "success" : "secondary"}
                            className="text-[10px] capitalize"
                          >
                            {cust.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(cust.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Team Members & Quick Action Shortcuts */}
        <div className="space-y-4">
          {/* Team Snapshot */}
          <Card className="border-border shadow-xs bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold">Research Personnel</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Active staff in this workspace
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                <Link href="/admin/employee">
                  View All
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {businessEmployees.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-lg">
                  <UserCheck className="mx-auto h-7 w-7 text-muted-foreground/50 mb-1" />
                  <p className="text-xs text-muted-foreground">No employees attached yet</p>
                  <Button asChild size="sm" variant="outline" className="mt-2 h-7 text-xs">
                    <Link href="/admin/employee">Invite Scientist</Link>
                  </Button>
                </div>
              ) : (
                businessEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50 text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-semibold text-foreground truncate">{emp.user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{emp.jobTitle}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {emp.department}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Hub Shortcuts */}
          <Card className="border-border shadow-xs bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start h-8 text-xs gap-2">
                <Link href="/admin/customer">
                  <Plus className="h-3.5 w-3.5 text-primary" />
                  Add Customer Record
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start h-8 text-xs gap-2">
                <Link href="/admin/employee">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Register Employee / Scientist
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start h-8 text-xs gap-2">
                <Link href="/admin/profile">
                  <ExternalLink className="h-3.5 w-3.5 text-primary" />
                  Edit Account Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
