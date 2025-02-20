DO $$ BEGIN
 CREATE TYPE "order_status" AS ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "shipping_provider" AS ENUM('JNE', 'TIKI', 'SICEPAT', 'GOSEND', 'GRAB_EXPRESS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "shipping_status" AS ENUM('PENDING', 'SHIPPED', 'DELIVERED', 'RETURNED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cart" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"order_date" timestamp with time zone DEFAULT now(),
	"total_amount" integer NOT NULL,
	"order_status" "order_status" DEFAULT 'PENDING' NOT NULL,
	"shipping_provider" "shipping_provider" NOT NULL,
	"shipping_code" text,
	"shipping_status" "shipping_status"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_detail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"payment_date" timestamp with time zone DEFAULT now(),
	"payment_method" text NOT NULL,
	"payment_reference" text NOT NULL,
	"amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid DEFAULT gen_random_uuid(),
	"tenant_id" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"username" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"full_name" varchar(256),
	"address" text,
	"phone_number" varchar(256),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_tenant_id_username_email_pk" PRIMARY KEY("tenant_id","username","email"),
	CONSTRAINT "users_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_detail" ADD CONSTRAINT "order_detail_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
