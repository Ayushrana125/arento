-- Storage policies for company-logos bucket
-- Run this in Supabase SQL Editor

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read access for company logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;

-- Allow anyone to read/view logos (public access)
CREATE POLICY "Public read access for company logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-logos');

-- Allow anyone to upload logos (since we're not using Supabase Auth)
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'company-logos');

-- Allow anyone to update logos
CREATE POLICY "Allow public updates"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'company-logos');

-- Allow anyone to delete logos
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'company-logos');
