-- RLS Policy: Allow authenticated users to select (required for inserts to work)
CREATE POLICY "Allow AAuthenticated select" ON "public"."intake_submissions"
  for SELECT
  to authenticated, anon
  using (true);