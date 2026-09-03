import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getCustomersAction } from "@/action/customer";
import { CustomerDialog } from "./_components/customer-dialog";
import { CustomerTable } from "./_components/customer-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers - BioTech Admin",
  description: "Manage clinical accounts and customer organizations",
};

export default async function CustomerPage() {
  const session = await getSession();

  if (!session || !session.activeBusiness) {
    redirect("/admin/business");
  }

  const activeBusiness = session.activeBusiness;

  // Server-side initial data fetch
  const customerResult = await getCustomersAction({ page: 1, pageSize: 10 });
  const initialData = customerResult.success
    ? customerResult.data
    : { items: [], total: 0, page: 1, pageSize: 10, totalPages: 1 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Customer Accounts</h1>
          <p className="text-xs text-muted-foreground">
            Clinical institutions, research hospitals, and partner accounts for{" "}
            <span className="font-semibold text-foreground">{activeBusiness.name}</span>
          </p>
        </div>
        <CustomerDialog />
      </div>

      {/* Customer Table with Search, Filter & Pagination from Server Action */}
      <CustomerTable initialData={initialData} />
    </div>
  );
}
