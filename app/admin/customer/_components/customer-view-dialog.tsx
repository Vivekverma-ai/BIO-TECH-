"use client";

import * as React from "react";
import { Building, Mail, Phone, Calendar, FileText, UserCheck, Shield } from "lucide-react";
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
import { formatDate } from "@/lib/utils";
import type { Customer } from "@/drizzle/type";

interface CustomerViewDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick?: () => void;
}

export function CustomerViewDialog({
  customer,
  open,
  onOpenChange,
  onEditClick,
}: CustomerViewDialogProps) {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-base font-bold text-foreground">
              Customer Account Details
            </DialogTitle>
            <Badge
              variant={customer.status === "active" ? "success" : "secondary"}
              className="text-[10px] capitalize"
            >
              {customer.status}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Complete account profile and enterprise affiliation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Main profile highlight */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              {customer.name.charAt(0)}
            </div>
            <div className="truncate">
              <h4 className="font-semibold text-sm text-foreground truncate">{customer.name}</h4>
              <p className="text-muted-foreground truncate">{customer.companyName || "Independent Client"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 p-2.5 rounded-md border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Email</span>
              <div className="flex items-center gap-1.5 text-foreground font-medium truncate">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{customer.email || "N/A"}</span>
              </div>
            </div>

            <div className="space-y-1 p-2.5 rounded-md border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Phone</span>
              <div className="flex items-center gap-1.5 text-foreground font-medium truncate">
                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{customer.phone || "N/A"}</span>
              </div>
            </div>

            <div className="space-y-1 p-2.5 rounded-md border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Account Type</span>
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="capitalize">{customer.type.replace("_", " ")}</span>
              </div>
            </div>

            <div className="space-y-1 p-2.5 rounded-md border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Registered</span>
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </div>

          {customer.notes && (
            <div className="space-y-1 p-2.5 rounded-md border border-border/70 bg-card">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Notes</span>
              <p className="text-muted-foreground leading-relaxed">{customer.notes}</p>
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
              Edit Account
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
