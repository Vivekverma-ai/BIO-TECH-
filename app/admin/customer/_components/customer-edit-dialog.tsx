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
import { updateCustomerAction } from "@/action/customer";
import { toast } from "sonner";
import type { Customer, CustomerStatus, CustomerType } from "@/drizzle/type";

interface CustomerEditDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CustomerEditDialog({
  customer,
  open,
  onOpenChange,
  onSuccess,
}: CustomerEditDialogProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [customerType, setCustomerType] = React.useState<CustomerType>("corporate");
  const [status, setStatus] = React.useState<CustomerStatus>("active");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  // Reset form when customer changes
  React.useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setEmail(customer.email || "");
      setPhone(customer.phone || "");
      setCompanyName(customer.companyName || "");
      setCustomerType(customer.type || "corporate");
      setStatus(customer.status || "active");
      setNotes(customer.notes || "");
      setError(null);
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    setError(null);
    startTransition(async () => {
      const result = await updateCustomerAction(customer.id, {
        name,
        email,
        phone,
        companyName,
        customerType,
        status,
        notes,
      });

      if (!result.success) {
        setError(result.error);
        toast.error("Failed to update customer", {
          description: result.error,
        });
        return;
      }

      toast.success("Customer account updated!", {
        description: "All changes have been persisted.",
      });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    });
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Edit Customer Account</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update account contact information, company, or status.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="customer-edit-form" className="space-y-3.5 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-cust-name" className="text-xs font-semibold">
              Contact / Primary Name *
            </Label>
            <Input
              id="edit-cust-name"
              placeholder="Dr. Jordan Mitchell"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="edit-cust-email" className="text-xs font-semibold">
                Email
              </Label>
              <Input
                id="edit-cust-email"
                type="email"
                placeholder="j.mitchell@clinic.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-cust-phone" className="text-xs font-semibold">
                Phone
              </Label>
              <Input
                id="edit-cust-phone"
                type="tel"
                placeholder="+1-555-0391"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-cust-org" className="text-xs font-semibold">
              Organization / Company
            </Label>
            <Input
              id="edit-cust-org"
              placeholder="Beacon Research Hospital"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="edit-cust-type" className="text-xs font-semibold">
                Customer Type
              </Label>
              <Select
                value={customerType}
                onValueChange={(val) => setCustomerType(val as CustomerType)}
              >
                <SelectTrigger id="edit-cust-type" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="research_institution">Research Institution</SelectItem>
                  <SelectItem value="hospital">Hospital / Clinic</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-cust-status" className="text-xs font-semibold">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as CustomerStatus)}
              >
                <SelectTrigger id="edit-cust-status" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="churned">Churned</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
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
            form="customer-edit-form"
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
