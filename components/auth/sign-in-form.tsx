"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dna, Loader2, Lock, Mail, ArrowRight, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { signInAction } from "@/action/auth";
import { toast } from "sonner";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signInAction({ email, password });
      if (!result.success) {
        setError(result.error);
        toast.error("Sign in failed", {
          description: result.error,
        });
        return;
      }

      toast.success("Welcome back!", {
        description: "Authentication successful. Redirecting to workspace...",
      });
      router.push(result.data.redirectUrl);
      router.refresh();
    });
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError(null);

    startTransition(async () => {
      const result = await signInAction({ email: demoEmail, password: "password123" });
      if (!result.success) {
        setError(result.error);
        toast.error("Sign in failed", {
          description: result.error,
        });
        return;
      }

      toast.success("Demo login authenticated!", {
        description: `Signed in as ${demoEmail}`,
      });
      router.push(result.data.redirectUrl);
      router.refresh();
    });
  };

  return (
    <Card className="w-full max-w-md border-border/80 shadow-xl bg-card/95 backdrop-blur-sm">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <Dna className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome to BioTech</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Sign in to access your enterprise laboratory and business workspace
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Work Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@biotech-innovations.io"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password
              </Label>
              <Link
                href="/auth/reset-password"
                className="text-[11px] font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-9 text-xs font-semibold shadow-md"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Demo Fast Logins Section */}
        <div className="pt-3 border-t border-border/60">
          <p className="text-[11px] font-medium text-muted-foreground mb-2 text-center">
            ⚡ Quick Test / Demo Accounts:
          </p>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("alexander.wright@biotech-innovations.io")}
              disabled={isPending}
              className="flex items-center justify-between p-2 rounded-lg border border-border/70 hover:border-primary/50 hover:bg-accent/50 text-left transition-all text-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold text-foreground text-[11px]">Dr. Alexander Wright</p>
                  <p className="text-[10px] text-muted-foreground">Owner (Has Business ID)</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                Opens Dashboard
              </Badge>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("elena.rostova@biotech-innovations.io")}
              disabled={isPending}
              className="flex items-center justify-between p-2 rounded-lg border border-border/70 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-left transition-all text-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="font-semibold text-foreground text-[11px]">Dr. Elena Rostova</p>
                  <p className="text-[10px] text-muted-foreground">Employee Director</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[9px] bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                Opens Dashboard
              </Badge>
            </button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 border-t border-border/60 pt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
