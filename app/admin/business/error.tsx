"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function BusinessError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center space-y-3">
      <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
      <h3 className="text-sm font-bold text-foreground">Failed to load business data</h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto">{error.message}</p>
      <Button onClick={() => reset()} size="sm" variant="outline" className="h-8 text-xs gap-1.5">
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  );
}
