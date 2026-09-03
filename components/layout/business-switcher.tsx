"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Business } from "@/drizzle/type";

interface BusinessSwitcherProps {
  businesses?: Business[];
  activeBusiness: Business | null;
}

export function BusinessSwitcher({ activeBusiness }: BusinessSwitcherProps) {
  if (!activeBusiness) {
    return (
      <Button
        asChild
        variant="outline"
        size="sm"
        className="h-9 gap-2 border-dashed text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <Link href="/admin/business">
          <Building2 className="h-3.5 w-3.5" />
          Setup Business
        </Link>
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="h-9 gap-2 px-3 max-w-[240px] bg-card border-border/80 hover:bg-accent shadow-xs"
    >
      <Link href="/admin/business">
        <div className="flex items-center gap-2 truncate">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Building2 className="h-3.5 w-3.5" />
          </div>
          <span className="truncate text-xs font-semibold text-foreground">
            {activeBusiness.name}
          </span>
          <Badge
            variant={activeBusiness.status === "active" ? "success" : "secondary"}
            className="text-[9px] px-1 py-0 capitalize shrink-0 hidden sm:inline-flex"
          >
            {activeBusiness.status}
          </Badge>
        </div>
      </Link>
    </Button>
  );
}
