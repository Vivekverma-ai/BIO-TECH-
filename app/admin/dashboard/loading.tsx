import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex h-64 w-full items-center justify-center space-x-2 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
      <span className="text-xs font-medium">Loading workspace data...</span>
    </div>
  );
}
