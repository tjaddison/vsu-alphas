-- Update RLS policy to allow anonymous users to read membership dues
-- This is needed for the admin dashboard which uses the anon key
DROP POLICY IF EXISTS "Only authenticated users can view submissions" ON public.membership_dues;

CREATE POLICY "Allow anon and authenticated users to view submissions"
ON public.membership_dues
FOR SELECT
TO anon, authenticated
USING (true);
