"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Loader2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Save,
} from "lucide-react";
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
import { createBusinessAction, updateBusinessAction } from "@/action/bussiness";
import { toast } from "sonner";
import type { Business, BusinessStatus } from "@/drizzle/type";

interface BusinessFormProps {
  business?: Business | null;
  isOnboarding?: boolean;
}

export function BusinessForm({ business, isOnboarding = false }: BusinessFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(business);

  const [name, setName] = React.useState(business?.name || "");
  const [slug, setSlug] = React.useState(business?.slug || "");
  const [email, setEmail] = React.useState(business?.email || "");
  const [phone, setPhone] = React.useState(business?.phone || "");
  const [website, setWebsite] = React.useState(business?.website || "");
  const [address, setAddress] = React.useState(business?.address || "");
  const [registrationNumber, setRegistrationNumber] = React.useState(
    business?.registrationNumber || ""
  );
  const [taxId, setTaxId] = React.useState(business?.taxId || "");
  const [status, setStatus] = React.useState<BusinessStatus>(business?.status || "active");
  const [industry, setIndustry] = React.useState<string>(
    (business?.metadata as { industry?: string })?.industry ||
      "Biotechnology & Molecular Genomics"
  );

  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditMode) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
      setSlug(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      if (isEditMode && business) {
        // UPDATE Existing Business
        const result = await updateBusinessAction(business.id, {
          name,
          slug,
          email,
          phone,
          website,
          address,
          registrationNumber,
          taxId,
          status,
          metadata: {
            ...((business.metadata as Record<string, unknown>) || {}),
            industry,
          },
        });

        if (!result.success) {
          setError(result.error);
          toast.error("Failed to update business", {
            description: result.error,
          });
          return;
        }

        setSuccessMessage("Business details updated successfully!");
        toast.success("Business profile updated!", {
          description: "All workspace information saved.",
        });
        router.refresh();
      } else {
        // CREATE First-time Business (when user has 0 businesses)
        const result = await createBusinessAction({
          name,
          slug,
          email,
          phone,
          website,
          address,
          registrationNumber,
          taxId,
          status,
          metadata: {
            industry,
            setupCompleted: true,
          },
        });

        if (!result.success) {
          setError(result.error);
          toast.error("Failed to initialize business", {
            description: result.error,
          });
          return;
        }

        toast.success("Workspace created!", {
          description: "Your biotech business workspace is ready.",
        });
        router.push(result.data.redirectUrl);
        router.refresh();
      }
    });
  };

  return (
    <Card className="border-border shadow-md bg-card">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center gap-2 text-primary">
          <Building2 className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {isEditMode ? "Edit Organization Profile" : "First-time Setup"}
          </span>
        </div>
        <CardTitle className="text-xl font-bold">
          {isEditMode
            ? "Update Business Profile & Settings"
            : "Create Your Biotech Business Workspace"}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {isEditMode
            ? "Modify enterprise credentials, legal registration, and contact information"
            : "Fill in the enterprise credentials and contact details to initialize your business"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2 rounded-md bg-emerald-500/15 p-3 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form id="business-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="biz-name" className="text-xs font-semibold">
                Business Name *
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="biz-name"
                  placeholder="e.g. Apex Genomics Research Lab"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biz-slug" className="text-xs font-semibold">
                Workspace Slug / Identifier *
              </Label>
              <div className="flex items-center rounded-md border border-input bg-muted/30 px-3 h-9 text-xs">
                <span className="text-muted-foreground mr-1">/</span>
                <input
                  id="biz-slug"
                  placeholder="apex-genomics"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-foreground text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="biz-email" className="text-xs font-semibold">
                Official Contact Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="biz-email"
                  type="email"
                  placeholder="contact@apexgenomics.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biz-phone" className="text-xs font-semibold">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="biz-phone"
                  type="tel"
                  placeholder="+1-800-555-APEX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biz-website" className="text-xs font-semibold">
                Website URL
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="biz-website"
                  type="url"
                  placeholder="https://apexgenomics.io"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="biz-address" className="text-xs font-semibold">
              Laboratory / Facility Physical Address
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="biz-address"
                placeholder="700 Innovation Boulevard, Tech Park Suite 400, Cambridge, MA"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="biz-reg" className="text-xs font-semibold">
                Registration / License No.
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="biz-reg"
                  placeholder="REG-MA-2024-8991"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biz-tax" className="text-xs font-semibold">
                Tax ID / EIN
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="biz-tax"
                  placeholder="XX-XXXXXXX"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biz-industry" className="text-xs font-semibold">
                Specialization / Domain
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="biz-industry" className="h-9 text-xs">
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Biotechnology & Molecular Genomics">
                    Molecular Genomics & CRISPR
                  </SelectItem>
                  <SelectItem value="Clinical Diagnostics & Pathology">
                    Clinical Diagnostics & Pathology
                  </SelectItem>
                  <SelectItem value="Pharmaceutical Research & Oncology">
                    Pharmaceuticals & Oncology
                  </SelectItem>
                  <SelectItem value="Bioinformatics & Computational Bio">
                    Bioinformatics & AI Discovery
                  </SelectItem>
                  <SelectItem value="Stem Cell & Regenerative Medicine">
                    Regenerative Medicine
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Selection (when updating) */}
          {isEditMode && (
            <div className="space-y-1.5 max-w-xs">
              <Label htmlFor="biz-status" className="text-xs font-semibold">
                Operational Status
              </Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as BusinessStatus)}
              >
                <SelectTrigger id="biz-status" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending_verification">Pending Verification</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>
            {isEditMode
              ? "All updates take effect across your lab dashboard immediately"
              : "Will automatically initialize and activate as your business"}
          </span>
        </div>
        <Button
          form="business-form"
          type="submit"
          disabled={isPending}
          className="h-9 px-5 text-xs font-semibold shadow-md"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? "Saving Updates..." : "Initializing Business..."}
            </>
          ) : (
            <>
              {isEditMode ? (
                <>
                  <Save className="mr-1.5 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  Create Workspace & Open Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
