CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"session_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"topic" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
