"use client";

import * as React from "react";
import {
  Search,
  RotateCcw,
  Building,
  Mail,
  Phone,
  Users,
  Loader2,
  MoreHorizontal,
  Eye,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationControls } from "@/components/ui/pagination";
import { getCustomersAction } from "@/action/customer";
import { formatDate } from "@/lib/utils";
import { CustomerViewDialog } from "./customer-view-dialog";
import { CustomerEditDialog } from "./customer-edit-dialog";
import type { Customer, CustomerStatus, CustomerType, PaginatedResult } from "@/drizzle/type";
import { CUSTOMER_STATUSES, CUSTOMER_TYPES } from "@/drizzle/enum";

interface CustomerTableProps {
  initialData: PaginatedResult<Customer>;
}

export function CustomerTable({ initialData }: CustomerTableProps) {
  const [data, setData] = React.useState<PaginatedResult<Customer>>(initialData);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<CustomerStatus | "all">("all");
  const [type, setType] = React.useState<CustomerType | "all">("all");
  const [page, setPage] = React.useState(initialData.page);
  const [pageSize, setPageSize] = React.useState(initialData.pageSize);
  const [isPending, startTransition] = React.useTransition();

  // Selected customer for View or Edit modals
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const fetchCustomers = (
    newPage = page,
    newPageSize = pageSize,
    newSearch = search,
    newStatus = status,
    newType = type
  ) => {
    startTransition(async () => {
      const res = await getCustomersAction({
        page: newPage,
        pageSize: newPageSize,
        search: newSearch,
        status: newStatus,
        type: newType,
      });

      if (res.success) {
        setData(res.data);
        setPage(res.data.page);
        setPageSize(res.data.pageSize);
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    fetchCustomers(1, pageSize, val, status, type);
  };

  const handleStatusChange = (val: string) => {
    const newStatus = val as CustomerStatus | "all";
    setStatus(newStatus);
    fetchCustomers(1, pageSize, search, newStatus, type);
  };

  const handleTypeChange = (val: string) => {
    const newType = val as CustomerType | "all";
    setType(newType);
    fetchCustomers(1, pageSize, search, status, newType);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setType("all");
    fetchCustomers(1, pageSize, "", "all", "all");
  };

  const handlePageChange = (newPage: number) => {
    fetchCustomers(newPage, pageSize, search, status, type);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    fetchCustomers(1, newPageSize, search, status, type);
  };

  const handleViewCustomer = (cust: Customer) => {
    setSelectedCustomer(cust);
    setIsViewOpen(true);
  };

  const handleEditCustomer = (cust: Customer) => {
    setSelectedCustomer(cust);
    setIsEditOpen(true);
  };

  const hasActiveFilters = search.length > 0 || status !== "all" || type !== "all";

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-border bg-card">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, company, or phone..."
            value={search}
            onChange={handleSearchChange}
            className="pl-8 text-xs h-9"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="w-36">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {CUSTOMER_STATUSES.map((st) => (
                  <SelectItem key={st} value={st} className="capitalize">
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="w-40">
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {CUSTOMER_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">
                    {t.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
              title="Reset Filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}

          {isPending && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        </div>
      </div>

      {/* Table Data Container */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {data.items.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Users className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <h3 className="text-sm font-semibold text-foreground">No customer records found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {hasActiveFilters
                ? "No accounts match your current filter criteria. Try resetting filters."
                : "No customer accounts registered under this workspace."}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="mt-3 h-8 text-xs gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Account / Contact</TableHead>
                <TableHead className="text-xs font-semibold">Organization</TableHead>
                <TableHead className="text-xs font-semibold">Customer Type</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Created Date</TableHead>
                <TableHead className="text-xs font-semibold w-[60px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((cust) => (
                <TableRow key={cust.id} className="text-xs">
                  <TableCell>
                    <div className="font-semibold text-foreground">{cust.name}</div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      {cust.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {cust.email}
                        </span>
                      )}
                      {cust.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {cust.phone}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <Building className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{cust.companyName || "N/A"}</span>
                    </div>
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
                  <TableCell className="text-center">
                    {/* Three Dots Action Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 p-1">
                        <DropdownMenuLabel className="text-[11px] text-muted-foreground">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewCustomer(cust)}
                          className="cursor-pointer text-xs gap-2 py-1.5"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditCustomer(cust)}
                          className="cursor-pointer text-xs gap-2 py-1.5 text-primary focus:text-primary"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Server-Action Pagination Controls */}
        <PaginationControls
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          disabled={isPending}
        />
      </div>

      {/* Customer View Dialog */}
      <CustomerViewDialog
        customer={selectedCustomer}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        onEditClick={() => setIsEditOpen(true)}
      />

      {/* Customer Edit Dialog */}
      <CustomerEditDialog
        customer={selectedCustomer}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={() => fetchCustomers(page, pageSize, search, status, type)}
      />
    </div>
  );
}
