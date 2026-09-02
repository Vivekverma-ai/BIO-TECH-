CREATE TYPE "public"."customer_status" AS ENUM('lead', 'active', 'inactive', 'churned', 'archived');--> statement-breakpoint
CREATE TYPE "public"."customer_type" AS ENUM('individual', 'corporate', 'research_institution', 'hospital', 'government');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"user_id" uuid,
	"assigned_employee_id" uuid,
	"customer_code" varchar(100),
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"company_name" varchar(255),
	"type" "customer_type" DEFAULT 'individual' NOT NULL,
	"status" "customer_status" DEFAULT 'lead' NOT NULL,
	"tax_id" varchar(100),
	"credit_limit" numeric(12, 2),
	"billing_address" text,
	"shipping_address" text,
	"notes" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_assigned_employee_id_employees_id_fk" FOREIGN KEY ("assigned_employee_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;