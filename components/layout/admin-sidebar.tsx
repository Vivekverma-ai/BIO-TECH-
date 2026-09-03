"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  UserCog,
  Dna,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/action/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Business, User } from "@/drizzle/type";

interface AdminSidebarProps {
  user: User;
  activeBusiness: Business | null;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Business Profile",
    href: "/admin/business",
    icon: Building2,
    badge: null,
  },
  {
    title: "Customers",
    href: "/admin/customer",
    icon: Users,
    badge: null,
  },
  {
    title: "Employees",
    href: "/admin/employee",
    icon: UserCheck,
    badge: null,
  },
  {
    title: "Profile & Settings",
    href: "/admin/profile",
    icon: UserCog,
    badge: null,
  },
];

export function AdminSidebar({ user, activeBusiness }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, startLogout] = React.useTransition();

  const handleLogout = () => {
    startLogout(async () => {
      const res = await signOutAction();
      if (res.success && res.data?.redirectUrl) {
        toast.success("Logged out successfully");
        router.push(res.data.redirectUrl);
        router.refresh();
      }
    });
  };

  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground md:flex">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
          <Dna className="h-5 w-5 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-sidebar-foreground">
              BioTech
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1 rounded">
              Hub
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Enterprise Admin
          </span>
        </div>
      </div>

      {/* Active Business Banner in Sidebar */}
      <div className="px-3.5 py-3 border-b border-sidebar-border/60 bg-sidebar-accent/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-medium text-sidebar-foreground truncate">
              {activeBusiness ? activeBusiness.name : "No Active Business"}
            </span>
          </div>
          {activeBusiness && (
            <Badge variant="outline" className="text-[9px] px-1 py-0 shrink-0 capitalize">
              {activeBusiness.status}
            </Badge>
          )}
        </div>
        {activeBusiness?.slug && (
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate pl-4 font-mono">
            /{activeBusiness.slug}
          </p>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Core Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {isActive ? (
                <ChevronRight className="h-3.5 w-3.5 text-primary-foreground/80" />
              ) : item.badge ? (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {item.badge}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </div>

      {/* System Status / Quick Info */}
      <div className="p-3 border-t border-sidebar-border/80">
        <div className="rounded-lg bg-primary/5 p-3 border border-primary/15">
          <div className="flex items-center gap-1.5 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">GLP & ISO Ready</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
            All audit trails and relation logs are encrypted and synchronized.
          </p>
        </div>

        {/* Sidebar Footer User / Logout button */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-sidebar-border/60">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Log out"
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
