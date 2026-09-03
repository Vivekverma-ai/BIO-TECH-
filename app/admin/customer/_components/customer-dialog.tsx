"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
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
import { createCustomerAction } from "@/action/customer";
import { toast } from "sonner";
import type { CustomerStatus, CustomerType } from "@/drizzle/type";

export function CustomerDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [customerType, setCustomerType] = React.useState<CustomerType>("corporate");
  const [status, setStatus] = React.useState<CustomerStatus>("active");
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createCustomerAction({
        name,
        email,
        phone,
        companyName,
        customerType,
        status,
      });

      if (!result.success) {
        setError(result.error);
        toast.error("Failed to add customer", {
          description: result.error,
        });
        return;
      }

      toast.success("Customer account registered!", {
        description: `${name} added to workspace.`,
      });
      setOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setCompanyName("");
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-1.5 text-xs shadow-sm">
          <Plus className="h-3.5 w-3.5" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Register Customer Account</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Create a clinical or corporate client profile under this active workspace.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} id="customer-form" className="space-y-3.5 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="cust-name" className="text-xs font-semibold">
              Contact / Primary Name *
            </Label>
            <Input
              id="cust-name"
              placeholder="Dr. Jordan Mitchell"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="cust-email" className="text-xs font-semibold">
                Email
              </Label>
              <Input
                id="cust-email"
                type="email"
                placeholder="j.mitchell@clinic.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cust-phone" className="text-xs font-semibold">
                Phone
              </Label>
              <Input
                id="cust-phone"
                type="tel"
                placeholder="+1-555-0391"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cust-org" className="text-xs font-semibold">
              Organization / Company
            </Label>
            <Input
              id="cust-org"
              placeholder="Beacon Research Hospital"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="cust-type" className="text-xs font-semibold">
                Customer Type
              </Label>
              <Select
                value={customerType}
                onValueChange={(val) => setCustomerType(val as CustomerType)}
              >
                <SelectTrigger id="cust-type" className="h-9 text-xs">
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
              <Label htmlFor="cust-status" className="text-xs font-semibold">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as CustomerStatus)}
              >
                <SelectTrigger id="cust-status" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
            form="customer-form"
            type="submit"
            disabled={isPending}
            size="sm"
            className="h-8 text-xs"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
            Save Customer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
