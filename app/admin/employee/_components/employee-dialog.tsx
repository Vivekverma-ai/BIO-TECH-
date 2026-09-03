"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEmployeeAction } from "@/action/employee";
import { toast } from "sonner";
import type { EmploymentStatus, EmploymentType } from "@/drizzle/type";

export function EmployeeDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [department, setDepartment] = React.useState("Molecular Genetics");
  const [employeeCode, setEmployeeCode] = React.useState("");
  const [employmentType, setEmploymentType] = React.useState<EmploymentType>("full_time");
  const [employmentStatus, setEmploymentStatus] = React.useState<EmploymentStatus>("active");
  const [salary, setSalary] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createEmployeeAction({
        name,
        email,
        jobTitle,
        department,
        employeeCode,
        employmentType,
        employmentStatus,
        salary,
      });

      if (!result.success) {
        setError(result.error);
        toast.error("Failed to register employee", {
          description: result.error,
        });
        return;
      }

      toast.success("Employee registered!", {
        description: `${name} has been added to laboratory personnel.`,
      });
      setOpen(false);
      setName("");
      setEmail("");
      setJobTitle("");
      setEmployeeCode("");
      setSalary("");
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-1.5 text-xs shadow-sm">
          <UserPlus className="h-3.5 w-3.5" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Register Staff / Scientist</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Add a team member to this active laboratory workspace.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="employee-form" className="space-y-3.5 py-2">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="emp-name" className="text-xs font-semibold">
                Full Name *
              </Label>
              <Input
                id="emp-name"
                placeholder="Dr. Maya Patel"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-email" className="text-xs font-semibold">
                Work Email *
              </Label>
              <Input
                id="emp-email"
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
              <Label htmlFor="emp-title" className="text-xs font-semibold">
                Job Title *
              </Label>
              <Input
                id="emp-title"
                placeholder="Senior Geneticist"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-dept" className="text-xs font-semibold">
                Department *
              </Label>
              <Input
                id="emp-dept"
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
              <Label htmlFor="emp-code" className="text-xs font-semibold">
                Employee Code
              </Label>
              <Input
                id="emp-code"
                placeholder="EMP-SCI-005"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-salary" className="text-xs font-semibold">
                Base Salary (USD)
              </Label>
              <Input
                id="emp-salary"
                placeholder="120000.00"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="emp-type" className="text-xs font-semibold">
                Employment Type
              </Label>
              <Select
                value={employmentType}
                onValueChange={(val) => setEmploymentType(val as EmploymentType)}
              >
                <SelectTrigger id="emp-type" className="h-9 text-xs">
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
              <Label htmlFor="emp-status" className="text-xs font-semibold">
                Status
              </Label>
              <Select
                value={employmentStatus}
                onValueChange={(val) => setEmploymentStatus(val as EmploymentStatus)}
              >
                <SelectTrigger id="emp-status" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
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
            onClick={() => setOpen(false)}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            form="employee-form"
            type="submit"
            disabled={isPending}
            size="sm"
            className="h-8 text-xs"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
            Register Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
