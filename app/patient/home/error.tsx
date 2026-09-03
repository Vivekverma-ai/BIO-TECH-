"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background text-foreground text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive mb-4">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h1 className="text-xl font-bold tracking-tight mb-1">Something went wrong</h1>
      <p className="text-xs text-muted-foreground max-w-md mb-6">
        {error.message || "An unexpected error occurred while processing your request."}
      </p>
      <div className="flex items-center gap-3">
        <Button onClick={() => reset()} size="sm" className="h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </Button>
        <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <Link href="/">
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
