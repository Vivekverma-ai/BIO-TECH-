"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateEmployeeAction, type EmployeeWithUserData } from "@/action/employee";
import { toast } from "sonner";
import type { EmploymentStatus, EmploymentType } from "@/drizzle/type";

interface EmployeeEditDialogProps {
  employee: EmployeeWithUserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EmployeeEditDialog({
  employee,
  open,
  onOpenChange,
  onSuccess,
}: EmployeeEditDialogProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [department, setDepartment] = React.useState("Molecular Genetics");
  const [employeeCode, setEmployeeCode] = React.useState("");
  const [employmentType, setEmploymentType] = React.useState<EmploymentType>("full_time");
  const [employmentStatus, setEmploymentStatus] = React.useState<EmploymentStatus>("active");
  const [salary, setSalary] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (employee) {
      setName(employee.user.name || "");
      setEmail(employee.user.email || "");
      setPhone(employee.user.phone || "");
      setJobTitle(employee.jobTitle || "");
      setDepartment(employee.department || "Molecular Genetics");
      setEmployeeCode(employee.employeeCode || "");
      setEmploymentType(employee.employmentType || "full_time");
      setEmploymentStatus(employee.employmentStatus || "active");
      setSalary(employee.salary || "");
      setNotes(employee.notes || "");
      setError(null);
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    setError(null);
    startTransition(async () => {
      const result = await updateEmployeeAction(employee.id, {
        name,
        email,
        phone,
        jobTitle,
        department,
        employeeCode,
        employmentType,
        employmentStatus,
        salary,
        notes,
      });

      if (!result.success) {
        setError(result.error);
        toast.error("Failed to update staff profile", {
          description: result.error,
        });
        return;
      }

      toast.success("Staff profile updated!", {
        description: "Personnel changes have been saved.",
      });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    });
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Edit Staff Profile</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update role details, department, code, or employment status.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="employee-edit-form" className="space-y-3.5 py-2">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="edit-emp-name" className="text-xs font-semibold">
                Full Name *
              </Label>
              <Input
                id="edit-emp-name"
                placeholder="Dr. Maya Patel"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-emp-email" className="text-xs font-semibold">
                Work Email *
              </Label>
              <Input
                id="edit-emp-email"
                type="email"
                placeholder="m.patel@lab.io"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="edit-emp-title" className="text-xs font-semibold">
                Job Title *
              </Label>
              <Input
                id="edit-emp-title"
                placeholder="Senior Geneticist"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-emp-dept" className="text-xs font-semibold">
                Department *
              </Label>
              <Input
                id="edit-emp-dept"
                placeholder="Molecular Genetics"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="edit-emp-code" className="text-xs font-semibold">
                Employee Code
              </Label>
              <Input
                id="edit-emp-code"
                placeholder="EMP-SCI-005"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-emp-salary" className="text-xs font-semibold">
                Base Salary (USD)
              </Label>
              <Input
                id="edit-emp-salary"
                placeholder="120000.00"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="edit-emp-type" className="text-xs font-semibold">
                Employment Type
              </Label>
              <Select
                value={employmentType}
                onValueChange={(val) => setEmploymentType(val as EmploymentType)}
              >
                <SelectTrigger id="edit-emp-type" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="intern">Intern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-emp-status" className="text-xs font-semibold">
                Status
              </Label>
              <Select
                value={employmentStatus}
                onValueChange={(val) => setEmploymentStatus(val as EmploymentStatus)}
              >
                <SelectTrigger id="edit-emp-status" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                  <SelectItem value="resigned">Resigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            form="employee-edit-form"
            type="submit"
            disabled={isPending}
            size="sm"
            className="h-8 text-xs"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
