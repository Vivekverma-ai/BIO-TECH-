import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background text-foreground text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <FileQuestion className="h-7 w-7" />
      </div>
      <h1 className="text-xl font-bold tracking-tight mb-1">Page Not Found</h1>
      <p className="text-xs text-muted-foreground max-w-md mb-6">
        The requested resource, laboratory record, or page could not be located.
      </p>
      <div className="flex items-center gap-3">
        <Button asChild size="sm" className="h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700">
          <Link href="/">
            <Home className="h-3.5 w-3.5" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
