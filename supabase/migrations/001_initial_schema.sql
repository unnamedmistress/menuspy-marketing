-- Initial PermitPath Database Schema
-- Run this in Supabase SQL Editor

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  phone TEXT,
  contractor_license TEXT,
  business_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  job_type TEXT NOT NULL,
  title TEXT NOT NULL,
  property_address TEXT NOT NULL,
  jurisdiction TEXT DEFAULT 'PINELLAS_COUNTY',
  status TEXT DEFAULT 'draft',
  estimated_cost DECIMAL(10,2),
  estimated_days INTEGER,
  description TEXT,
  building_type TEXT,
  is_altering_shape BOOLEAN DEFAULT FALSE,
  is_tankless BOOLEAN DEFAULT FALSE,
  is_gas BOOLEAN DEFAULT FALSE,
  deck_height TEXT,
  is_attached BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requirements table
CREATE TABLE requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'pending',
  action_type TEXT,
  source_url TEXT,
  minimum_criteria TEXT,
  who_can_help TEXT,
  plain_language_why TEXT,
  accepted_formats TEXT[],
  allows_multiple_uploads BOOLEAN DEFAULT FALSE,
  good_upload_example TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  requirement_id UUID REFERENCES requirements(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Jobs: Users can only see/edit their own jobs
CREATE POLICY "Users can view own jobs" ON jobs
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create own jobs" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own jobs" ON jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- Requirements: Visible to job owner
CREATE POLICY "Users can view job requirements" ON requirements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM jobs WHERE jobs.id = job_id 
      AND (jobs.user_id IS NULL OR jobs.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create job requirements" ON requirements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs WHERE jobs.id = job_id 
      AND (jobs.user_id IS NULL OR jobs.user_id = auth.uid())
    )
  );

-- Documents: Only job owner
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Users can access own documents" ON storage.objects
  FOR ALL USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();