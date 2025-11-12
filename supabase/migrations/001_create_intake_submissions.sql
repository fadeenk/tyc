-- Create intake_submissions table
CREATE TABLE intake_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'reviewed', 'assigned', 'rejected')),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  case_type VARCHAR(50) NOT NULL CHECK (case_type IN ('personal_injury', 'consumer_protection', 'other')),
  case_description TEXT NOT NULL,
  incident_date DATE,
  location VARCHAR(255),
  urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('low', 'medium', 'high')),
  lawyer_notes TEXT,
  assigned_lawyer_id UUID
);

-- Add indexes for performance (per data-model.md)
CREATE INDEX intake_submissions_created_at_idx ON intake_submissions(created_at);
CREATE INDEX intake_submissions_status_idx ON intake_submissions(status);
CREATE INDEX intake_submissions_case_type_idx ON intake_submissions(case_type);

-- Enable Row Level Security
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to insert new submissions
CREATE POLICY "Allow public insert" ON intake_submissions
  to authenticated, anon
  FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to automatically update updated_at
CREATE TRIGGER update_intake_submissions_updated_at 
  BEFORE UPDATE ON intake_submissions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
