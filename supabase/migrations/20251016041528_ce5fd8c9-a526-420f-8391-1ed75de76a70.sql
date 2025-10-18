-- Create membership dues submissions table
CREATE TABLE public.membership_dues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  year_crossed TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.membership_dues ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their membership information
CREATE POLICY "Anyone can submit membership dues"
ON public.membership_dues
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only allow reading for authenticated admin users (you can adjust this later)
CREATE POLICY "Only authenticated users can view submissions"
ON public.membership_dues
FOR SELECT
TO authenticated
USING (true);