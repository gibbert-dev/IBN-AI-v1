
-- Add context column to the translations table
ALTER TABLE public.translations 
ADD COLUMN context text;
