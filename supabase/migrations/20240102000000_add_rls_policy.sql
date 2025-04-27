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