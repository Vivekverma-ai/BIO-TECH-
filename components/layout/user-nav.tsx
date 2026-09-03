"use client";

import * as React from "react";
import { LogOut, User as UserIcon, Shield, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/action/auth";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import type { User } from "@/drizzle/type";

interface UserNavProps {
  user: User;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const [isLoggingOut, startLogoutTransition] = React.useTransition();

  const handleSignOut = () => {
    startLogoutTransition(async () => {
      const res = await signOutAction();
      if (res.success && res.data?.redirectUrl) {
        toast.success("Logged out successfully");
        router.push(res.data.redirectUrl);
        router.refresh();
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full ring-1 ring-border/80 hover:ring-primary/40 focus:ring-2 focus:ring-primary"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium text-xs">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-1" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold leading-none truncate">{user.name}</p>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                {user.role.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push("/admin/profile")}
            className="cursor-pointer gap-2 py-1.5 text-xs"
          >
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span>Profile & Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/admin/business")}
            className="cursor-pointer gap-2 py-1.5 text-xs"
          >
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span>Business Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/admin/profile")}
            className="cursor-pointer gap-2 py-1.5 text-xs"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>Preferences</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="cursor-pointer gap-2 py-1.5 text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
