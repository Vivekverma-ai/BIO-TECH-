"use client";

import * as React from "react";
import { Bell, Dna, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BusinessSwitcher } from "./business-switcher";
import { UserNav } from "./user-nav";
import type { Business, User } from "@/drizzle/type";

interface AdminHeaderProps {
  user: User;
  businesses: Business[];
  activeBusiness: Business | null;
}

export function AdminHeader({
  user,
  businesses,
  activeBusiness,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side: Mobile Brand / Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Dna className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm">BioTech</span>
        </div>

        {/* Desktop Breadcrumb Navigation */}
        <div className="hidden sm:block">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard" className="text-xs">
                  Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs font-semibold">
                  Workspace
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Right side: Business Profile, Search, Notifications, User Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Business Workspace Indicator */}
        <BusinessSwitcher
          businesses={businesses}
          activeBusiness={activeBusiness}
        />

        {/* Quick Search Input */}
        <div className="relative hidden lg:block w-48 xl:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            className="h-9 pl-8 text-xs bg-muted/40 focus-visible:bg-background"
          />
        </div>

        {/* Notifications Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>

        {/* User Navigation Dropdown */}
        <UserNav user={user} />
      </div>
    </header>
  );
}
