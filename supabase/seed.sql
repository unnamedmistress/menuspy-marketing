-- Seed data for PermitPath
-- Insert sample job types configuration

INSERT INTO profiles (id, email, display_name)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'anonymous@permitpath.app', 'Anonymous User')
ON CONFLICT (id) DO NOTHING;

-- Note: In production, populate requirements based on job type
-- This will be handled by the AI analysis service