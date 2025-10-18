-- Add RLS policy to allow anonymous and authenticated users to update membership dues
-- This is needed for the admin dashboard to edit records
CREATE POLICY "Allow anon and authenticated users to update submissions"
ON public.membership_dues
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
