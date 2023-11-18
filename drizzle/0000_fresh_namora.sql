CREATE TABLE IF NOT EXISTS "contact" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
