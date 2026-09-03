"use client";

import * as React from "react";
import { Briefcase, Mail, Phone, Calendar, DollarSign, Building, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { EmployeeWithUserData } from "@/action/employee";

interface EmployeeViewDialogProps {
  employee: EmployeeWithUserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick?: () => void;
}

export function EmployeeViewDialog({
  employee,
  open,
  onOpenChange,
  onEditClick,
}: EmployeeViewDialogProps) {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-base font-bold text-foreground">
              Personnel Profile
            </DialogTitle>
            <Badge
              variant={employee.employmentStatus === "active" ? "success" : "secondary"}
              className="text-[10px] capitalize"
            >
              {employee.employmentStatus}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Staff identification, role assignments, and laboratory credentials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Main staff header */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              {employee.user.name.charAt(0)}
            </div>
            <div className="truncate">
              <h4 className="font-semibold text-sm text-foreground truncate">{employee.user.name}</h4>
              <p className="text-muted-foreground truncate font-medium">{employee.jobTitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 p-2.5 rounded-md border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Email</span>
              <div className="flex items-center gap-1.5 text-foreground font-medium truncate">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{employee.user.email}</span>
              </div>
            </div>

            <div className="space-y-1 p-2.5 rounded-md border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Department</span>
              <div className="flex items-center gap-1.5 text-foreground font-medium truncate">
                <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{employee.department}</span>
              </div>
            </div>

            <div className="space-y-1 p-2.5 rounded-md border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Employee Code</span>
              <div className="flex items-center gap-1.5 text-foreground font-mono font-medium">
                <UserCheck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{employee.employeeCode || "N/A"}</span>
              </div>
            </div>

            <div className="space-y-1 p-2.5 rounded-md border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Employment Type</span>
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="capitalize">{employee.employmentType?.replace("_", " ")}</span>
              </div>
            </div>

            <div className="space-y-1 p-2.5 rounded-md border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Salary (Annual)</span>
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <DollarSign className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{employee.salary ? formatCurrency(employee.salary) : "Not disclosed"}</span>
              </div>
            </div>

            <div className="space-y-1 p-2.5 rounded-md border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Hire Date</span>
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{formatDate(employee.hireDate || employee.createdAt)}</span>
              </div>
            </div>
          </div>

          {employee.notes && (
            <div className="space-y-1 p-2.5 rounded-md border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Notes & Research Focus</span>
              <p className="text-muted-foreground leading-relaxed">{employee.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs"
          >
            Close
          </Button>
          {onEditClick && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEditClick();
              }}
              className="h-8 text-xs"
            >
              Edit Staff Profile
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
