"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dna, Loader2, Lock, Mail, User, Phone, ArrowRight, ArrowLeft } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signUpAction } from "@/action/auth";
import { toast } from "sonner";
import type { UserRole } from "@/drizzle/type";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("business_owner");
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signUpAction({
        name,
        email,
        password,
        phone,
        role,
      });

      if (!result.success) {
        setError(result.error);
        toast.error("Registration failed", {
          description: result.error,
        });
        return;
      }

      toast.success("Account registered successfully!", {
        description: "Welcome to BioTech Innovations.",
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
        <CardTitle className="text-2xl font-bold tracking-tight">Create BioTech Account</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Register to launch and manage your laboratory workspace & team
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Dr. Sarah Connor"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Work Email *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="s.connor@lab-research.io"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold">
                Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1-555-0100"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs font-semibold">
              Account Role
            </Label>
            <Select
              value={role}
              onValueChange={(val) => setRole(val as UserRole)}
            >
              <SelectTrigger id="role" className="h-9 text-xs">
                <SelectValue placeholder="Select primary role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business_owner">Business Owner / Founder</SelectItem>
                <SelectItem value="employee">Laboratory Employee / Scientist</SelectItem>
                <SelectItem value="customer">Client / Customer Representative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-9 text-xs font-semibold shadow-md mt-2"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering & Initializing...
              </>
            ) : (
              <>
                Create Account & Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/60 pt-4">
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
