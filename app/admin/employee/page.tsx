import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getEmployeesAction } from "@/action/employee";
import { EmployeeDialog } from "./_components/employee-dialog";
import { EmployeeTable } from "./_components/employee-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employees - BioTech Admin",
  description: "Manage laboratory researchers, scientists, and staff members",
};

export default async function EmployeePage() {
  const session = await getSession();

  if (!session || !session.activeBusiness) {
    redirect("/admin/business");
  }

  const activeBusiness = session.activeBusiness;

  // Server-side initial data fetch
  const employeeResult = await getEmployeesAction({ page: 1, pageSize: 10 });
  const initialData = employeeResult.success
    ? employeeResult.data
    : { items: [], total: 0, page: 1, pageSize: 10, totalPages: 1 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Personnel & Staff</h1>
          <p className="text-xs text-muted-foreground">
            Research scientists, lab technicians, and managers for{" "}
            <span className="font-semibold text-foreground">{activeBusiness.name}</span>
          </p>
        </div>
        <EmployeeDialog />
      </div>

      {/* Employee Table with Search, Filter & Pagination from Server Action */}
      <EmployeeTable initialData={initialData} />
    </div>
  );
}
