# Supabase Database Setup

## Adding the Translation Column

If you encounter the error: `Error: Could not find the 'translation' column of 'transcriptions' in the schema cache`, you need to run the following SQL in the Supabase SQL Editor:

```sql
-- Add translation column to transcriptions table
ALTER TABLE "public"."transcriptions" 
ADD COLUMN IF NOT EXISTS "translation" TEXT;

-- Add source_language column if it doesn't exist
ALTER TABLE "public"."transcriptions" 
ADD COLUMN IF NOT EXISTS "source_language" VARCHAR(10);

-- Add target_language column if it doesn't exist
ALTER TABLE "public"."transcriptions" 
ADD COLUMN IF NOT EXISTS "target_language" VARCHAR(10);
```

## Row-Level Security Error

If you encounter the error: `Error: new row violates row-level security policy for table "transcriptions"`, you need to set up Row-Level Security policies for the transcriptions table. Run the following SQL:

```sql
-- Enable Row Level Security for transcriptions table
ALTER TABLE "public"."transcriptions" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert their own records
CREATE POLICY "Users can insert their own transcriptions" 
ON "public"."transcriptions" 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own transcriptions
CREATE POLICY "Users can view their own transcriptions" 
ON "public"."transcriptions" 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Create policy to allow users to update their own transcriptions
CREATE POLICY "Users can update their own transcriptions" 
ON "public"."transcriptions" 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own transcriptions
CREATE POLICY "Users can delete their own transcriptions" 
ON "public"."transcriptions" 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
```

## Recent Updates

### Maintaining Transcriptions During Login

The app now preserves transcription content when a user logs in. Before redirecting to the authentication page, the current transcription is saved to localStorage and then restored after successful login.

## How to Run SQL in Supabase

1. Log in to your Supabase dashboard
2. Select your project
3. Navigate to the SQL Editor (in the left sidebar)
4. Create a new query
5. Paste the SQL above
6. Click "Run" to execute the query

After running this SQL, your transcriptions table will have the necessary columns and security policies, and the save functionality will work correctly.

## Database Structure

The transcriptions table should now have the following columns:
- id (auto-generated)
- created_at (timestamp)
- title (text)
- content (text) - for the original transcription
- translation (text) - for the translated content
- source_language (varchar) - language code of the original content
- target_language (varchar) - language code of the translation
- user_id (uuid) - connects to the auth.users table 