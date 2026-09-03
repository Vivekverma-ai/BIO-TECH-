"use client";

import * as React from "react";
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction } from "@/action/auth";
import { toast } from "sonner";

export function PasswordForm({ userEmail }: { userEmail: string }) {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      toast.error("Password too short", {
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    startTransition(async () => {
      const res = await resetPasswordAction({
        email: userEmail,
        newPassword,
      });

      if (!res.success) {
        setError(res.error);
        toast.error("Failed to update password", {
          description: res.error,
        });
        return;
      }

      setSuccess(true);
      toast.success("Security credentials updated!", {
        description: "Your password has been changed successfully.",
      });
      setNewPassword("");
      setConfirmPassword("");
    });
  };

  return (
    <Card className="border-border shadow-xs bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-primary">
          <KeyRound className="h-4 w-4" />
          <CardTitle className="text-sm font-bold">Update Password & Security</CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Change your account password to ensure ongoing compliance
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {error && (
          <div className="rounded-md bg-destructive/10 p-2.5 text-xs font-medium text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-md bg-emerald-500/15 p-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4" />
            <span>Password updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} id="pwd-form" className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="new-pwd" className="text-xs font-semibold">
              New Password
            </Label>
            <Input
              id="new-pwd"
              type="password"
              placeholder="••••••••"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-pwd" className="text-xs font-semibold">
              Confirm New Password
            </Label>
            <Input
              id="confirm-pwd"
              type="password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-xs h-9"
            />
          </div>
        </form>
      </CardContent>

      <CardFooter className="pt-1 border-t border-border flex justify-end">
        <Button
          form="pwd-form"
          type="submit"
          disabled={isPending}
          size="sm"
          className="h-8 text-xs"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
          Update Password
        </Button>
      </CardFooter>
    </Card>
  );
}
