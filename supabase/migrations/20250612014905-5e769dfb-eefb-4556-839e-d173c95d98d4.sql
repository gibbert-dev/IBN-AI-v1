
-- Enable Row Level Security on the translations table
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Add a user_id column to track who created each translation
ALTER TABLE public.translations ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_id required for new records (but allow existing records without user_id)
ALTER TABLE public.translations ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Policy: Users can view all translations (public read access for the dataset)
CREATE POLICY "Anyone can view translations" ON public.translations
FOR SELECT TO authenticated, anon
USING (true);

-- Policy: Authenticated users can create their own translations
CREATE POLICY "Users can create their own translations" ON public.translations
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own translations
CREATE POLICY "Users can update their own translations" ON public.translations
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own translations
CREATE POLICY "Users can delete their own translations" ON public.translations
FOR DELETE TO authenticated
USING (auth.uid() = user_id);
