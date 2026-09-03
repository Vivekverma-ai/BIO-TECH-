import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function EmployeeNotFound() {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
      <FileQuestion className="mx-auto h-8 w-8 text-muted-foreground" />
      <h3 className="text-sm font-bold text-foreground">Employee Record Not Found</h3>
      <p className="text-xs text-muted-foreground">The requested staff record does not exist.</p>
      <Button asChild size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
        <Link href="/admin/employee">View Employees</Link>
      </Button>
    </div>
  );
}
