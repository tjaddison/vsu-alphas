-- Add home_address, year_graduated columns to membership_dues table
ALTER TABLE public.membership_dues 
  ADD COLUMN home_address TEXT,
  ADD COLUMN year_graduated TEXT;

-- Add length constraints for validation
ALTER TABLE public.membership_dues
  ADD CONSTRAINT home_address_length CHECK (home_address IS NULL OR (length(home_address) > 0 AND length(home_address) <= 200)),
  ADD CONSTRAINT year_graduated_format CHECK (year_graduated IS NULL OR year_graduated ~ '^[0-9]{4}$');