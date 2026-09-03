"use client";

import * as React from "react";
import {
  Search,
  RotateCcw,
  Briefcase,
  Mail,
  UserCheck,
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
import { getEmployeesAction, type EmployeeWithUserData } from "@/action/employee";
import { formatDate } from "@/lib/utils";
import { EmployeeViewDialog } from "./employee-view-dialog";
import { EmployeeEditDialog } from "./employee-edit-dialog";
import type { EmploymentStatus, EmploymentType, PaginatedResult } from "@/drizzle/type";
import { EMPLOYMENT_STATUSES, EMPLOYMENT_TYPES } from "@/drizzle/enum";

interface EmployeeTableProps {
  initialData: PaginatedResult<EmployeeWithUserData>;
}

export function EmployeeTable({ initialData }: EmployeeTableProps) {
  const [data, setData] = React.useState<PaginatedResult<EmployeeWithUserData>>(initialData);
  const [search, setSearch] = React.useState("");
  const [employmentStatus, setEmploymentStatus] = React.useState<EmploymentStatus | "all">("all");
  const [employmentType, setEmploymentType] = React.useState<EmploymentType | "all">("all");
  const [page, setPage] = React.useState(initialData.page);
  const [pageSize, setPageSize] = React.useState(initialData.pageSize);
  const [isPending, startTransition] = React.useTransition();

  // Selected employee for View or Edit modals
  const [selectedEmployee, setSelectedEmployee] = React.useState<EmployeeWithUserData | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const fetchEmployees = (
    newPage = page,
    newPageSize = pageSize,
    newSearch = search,
    newStatus = employmentStatus,
    newType = employmentType
  ) => {
    startTransition(async () => {
      const res = await getEmployeesAction({
        page: newPage,
        pageSize: newPageSize,
        search: newSearch,
        employmentStatus: newStatus,
        employmentType: newType,
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
    fetchEmployees(1, pageSize, val, employmentStatus, employmentType);
  };

  const handleStatusChange = (val: string) => {
    const newStatus = val as EmploymentStatus | "all";
    setEmploymentStatus(newStatus);
    fetchEmployees(1, pageSize, search, newStatus, employmentType);
  };

  const handleTypeChange = (val: string) => {
    const newType = val as EmploymentType | "all";
    setEmploymentType(newType);
    fetchEmployees(1, pageSize, search, employmentStatus, newType);
  };

  const handleResetFilters = () => {
    setSearch("");
    setEmploymentStatus("all");
    setEmploymentType("all");
    fetchEmployees(1, pageSize, "", "all", "all");
  };

  const handlePageChange = (newPage: number) => {
    fetchEmployees(newPage, pageSize, search, employmentStatus, employmentType);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    fetchEmployees(1, newPageSize, search, employmentStatus, employmentType);
  };

  const handleViewEmployee = (emp: EmployeeWithUserData) => {
    setSelectedEmployee(emp);
    setIsViewOpen(true);
  };

  const handleEditEmployee = (emp: EmployeeWithUserData) => {
    setSelectedEmployee(emp);
    setIsEditOpen(true);
  };

  const hasActiveFilters =
    search.length > 0 || employmentStatus !== "all" || employmentType !== "all";

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-border bg-card">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, job title, code, or department..."
            value={search}
            onChange={handleSearchChange}
            className="pl-8 text-xs h-9"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="w-36">
            <Select value={employmentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {EMPLOYMENT_STATUSES.map((st) => (
                  <SelectItem key={st} value={st} className="capitalize">
                    {st.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="w-36">
            <Select value={employmentType} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {EMPLOYMENT_TYPES.map((t) => (
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
            <UserCheck className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <h3 className="text-sm font-semibold text-foreground">No personnel records found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {hasActiveFilters
                ? "No staff match your current filter criteria. Try clearing filters."
                : "No employee accounts registered under this workspace."}
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
                <TableHead className="text-xs font-semibold">Staff Member</TableHead>
                <TableHead className="text-xs font-semibold">Job Title</TableHead>
                <TableHead className="text-xs font-semibold">Department</TableHead>
                <TableHead className="text-xs font-semibold">Employee Code</TableHead>
                <TableHead className="text-xs font-semibold">Employment Type</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Hired Date</TableHead>
                <TableHead className="text-xs font-semibold w-[60px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((emp) => (
                <TableRow key={emp.id} className="text-xs">
                  <TableCell>
                    <div className="font-semibold text-foreground">{emp.user.name}</div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                      <Mail className="h-3 w-3" /> {emp.user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{emp.jobTitle}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {emp.department}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-muted-foreground">
                    {emp.employeeCode}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] capitalize">
                      {emp.employmentType?.replace("_", " ") || "Full Time"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={emp.employmentStatus === "active" ? "success" : "secondary"}
                      className="text-[10px] capitalize"
                    >
                      {emp.employmentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(emp.hireDate || emp.createdAt)}
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
                          onClick={() => handleViewEmployee(emp)}
                          className="cursor-pointer text-xs gap-2 py-1.5"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditEmployee(emp)}
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

      {/* Employee View Dialog */}
      <EmployeeViewDialog
        employee={selectedEmployee}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        onEditClick={() => setIsEditOpen(true)}
      />

      {/* Employee Edit Dialog */}
      <EmployeeEditDialog
        employee={selectedEmployee}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={() => fetchEmployees(page, pageSize, search, employmentStatus, employmentType)}
      />
    </div>
  );
}
