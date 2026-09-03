import * as React from "react";
import { Dna, ShieldCheck, Activity, Award, FlaskConical } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background font-sans">
      {/* Left side: Biotech Brand Showcase (Desktop only) */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-12 text-white relative overflow-hidden">
        {/* Background ambient lighting effects */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

        {/* Top Brand Tagline */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/40">
            <Dna className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">BioTech Innovations</h2>
            <p className="text-xs text-zinc-400">Genomic & Clinical Enterprise Management</p>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
            <Award className="h-3.5 w-3.5" />
            <span>GLP & ISO-9001 Compliant Platform</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Accelerating Life Science & Laboratory Operations
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed">
            Manage your multi-tenant biotech businesses, research personnel, clinical customer relationships, and molecular pipeline data in one secure, unified portal.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-blue-400">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">Real-time Telemetry</p>
                <p className="text-[11px] text-zinc-500">Live assay monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
                <FlaskConical className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">Sample Tracking</p>
                <p className="text-[11px] text-zinc-500">End-to-end provenance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial / Compliance Stamp */}
        <div className="relative z-10 flex items-center justify-between text-xs text-zinc-500 pt-6 border-t border-zinc-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>256-Bit Encrypted Multi-Tenant Isolation</span>
          </div>
          <span>v2.4.0-production</span>
        </div>
      </div>

      {/* Right side: Auth Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-muted/20">
        {children}
      </div>
    </div>
  );
}
