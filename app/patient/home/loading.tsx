import { Dna } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 animate-pulse">
        <Dna className="h-6 w-6" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold tracking-tight">BioTech Innovations</p>
        <p className="text-xs text-muted-foreground animate-pulse">Loading workspace...</p>
      </div>
    </div>
  );
}
