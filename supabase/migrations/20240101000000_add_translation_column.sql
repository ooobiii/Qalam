-- Add translation column to transcriptions table
ALTER TABLE "public"."transcriptions" 
ADD COLUMN IF NOT EXISTS "translation" TEXT;

-- Add source_language column if it doesn't exist
ALTER TABLE "public"."transcriptions" 
ADD COLUMN IF NOT EXISTS "source_language" VARCHAR(10);

-- Add target_language column if it doesn't exist
ALTER TABLE "public"."transcriptions" 
ADD COLUMN IF NOT EXISTS "target_language" VARCHAR(10); 