-- =========================================================================
-- PROJECT DNA: SUPABASE DATABASE SCHEMA (PostgreSQL)
-- Platform for Discovering, Connecting, and Extending Student Projects
-- Kasetsart University Chalermphrakiat Sakon Nakhon Campus (KU CSC)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Faculties Table (4 คณะใน มก.ฉกส.)
CREATE TABLE IF NOT EXISTS faculties (
    id VARCHAR(50) PRIMARY KEY,
    name_th VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    color_hex VARCHAR(20) DEFAULT '#2563EB'
);

-- 2. Departments Table (ทุกสาขาวิชาใน มก.ฉกส.)
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,
    faculty_id VARCHAR(50) REFERENCES faculties(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name_th VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY,
    title_th VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    abstract_th TEXT NOT NULL,
    abstract_en TEXT,
    academic_year INT NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    cover_image_url TEXT,
    rating_score NUMERIC(3, 2) DEFAULT 4.8,
    view_count INT DEFAULT 0,
    fork_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DNA Cards (Structured Metadata for each project)
CREATE TABLE IF NOT EXISTS dna_cards (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    problem_statement TEXT NOT NULL,
    target_users TEXT[] DEFAULT '{}',
    tech_stack TEXT[] DEFAULT '{}',
    key_outcomes TEXT[] DEFAULT '{}',
    limitations TEXT[] DEFAULT '{}',
    hardware_specs TEXT,
    dataset_description TEXT,
    repository_url TEXT,
    demo_url TEXT,
    advisor_name VARCHAR(255),
    student_authors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Reusable Assets Table
CREATE TABLE IF NOT EXISTS reusable_assets (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_url TEXT NOT NULL,
    file_size VARCHAR(50),
    license VARCHAR(50) DEFAULT 'MIT / Open Academic',
    download_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Project Lineage Graph (Ancestor-Descendant Relationships)
CREATE TABLE IF NOT EXISTS project_lineages (
    id VARCHAR(50) PRIMARY KEY,
    parent_project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    child_project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    extension_type VARCHAR(100) NOT NULL,
    evolution_summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_lineage_edge UNIQUE (parent_project_id, child_project_id)
);

-- 7. Extension Gaps (AI Identified Development Opportunities)
CREATE TABLE IF NOT EXISTS extension_gaps (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    gap_title VARCHAR(255) NOT NULL,
    gap_description TEXT NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'Medium',
    recommended_tech TEXT[] DEFAULT '{}',
    potential_impact TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Challenges (University, Industry, Community Problems)
CREATE TABLE IF NOT EXISTS challenges (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    description TEXT NOT NULL,
    pain_points TEXT[] DEFAULT '{}',
    desired_outputs TEXT[] DEFAULT '{}',
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- 9. STORAGE BUCKETS
--    project-covers : project cover images (5 MB, images only)
--    project-files  : reusable-asset uploads from the "เพิ่มโปรเจกต์" form
--                     (25 MiB cap, mirrored client-side in
--                      src/lib/storageService.ts — keep both in sync)
--    Files must be written under <auth.uid>/... because the policies below
--    scope every write to the first path segment.
-- =========================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('project-covers', 'project-covers', true, 5242880,
   ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]),
  ('project-files', 'project-files', true, 26214400,
   ARRAY[
     'application/pdf',
     'application/zip',
     'application/x-zip-compressed',
     'application/x-rar-compressed',
     'application/vnd.rar',
     'application/x-7z-compressed',
     'application/octet-stream',
     'text/plain',
     'text/csv',
     'text/markdown',
     'application/json',
     'application/xml',
     'text/x-python',
     'text/javascript',
     'application/msword',
     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
     'application/vnd.ms-excel',
     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
     'application/vnd.ms-powerpoint',
     'application/vnd.openxmlformats-officedocument.presentationml.presentation',
     'image/png',
     'image/jpeg',
     'image/webp'
   ]::text[])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: public read; writes scoped to the owner's uid folder
CREATE POLICY "Public read project covers" ON storage.objects FOR SELECT TO public USING (bucket_id = 'project-covers');
CREATE POLICY "Users upload own project covers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-covers' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own project covers" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-covers' AND (storage.foldername(name))[1] = auth.uid()::text) WITH CHECK (bucket_id = 'project-covers' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own project covers" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-covers' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public read project files" ON storage.objects FOR SELECT TO public USING (bucket_id = 'project-files');
CREATE POLICY "Users upload own project files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-files' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own project files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-files' AND (storage.foldername(name))[1] = auth.uid()::text) WITH CHECK (bucket_id = 'project-files' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own project files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-files' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(academic_year);
CREATE INDEX IF NOT EXISTS idx_projects_dept ON projects(department_id);
CREATE INDEX IF NOT EXISTS idx_lineage_parent ON project_lineages(parent_project_id);
CREATE INDEX IF NOT EXISTS idx_lineage_child ON project_lineages(child_project_id);
CREATE INDEX IF NOT EXISTS idx_assets_project ON reusable_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_gaps_project ON extension_gaps(project_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE dna_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reusable_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_lineages ENABLE ROW LEVEL SECURITY;
ALTER TABLE extension_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Read Policies: Open read for academic project exploration
CREATE POLICY "Allow public read faculties" ON faculties FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read departments" ON departments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read projects" ON projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read dna_cards" ON dna_cards FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read reusable_assets" ON reusable_assets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read project_lineages" ON project_lineages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read extension_gaps" ON extension_gaps FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read challenges" ON challenges FOR SELECT TO anon, authenticated USING (true);

-- Insert & Update Policies for Project Submissions
CREATE POLICY "Allow insert projects" ON projects FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow insert dna_cards" ON dna_cards FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow insert reusable_assets" ON reusable_assets FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow insert project_lineages" ON project_lineages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow insert extension_gaps" ON extension_gaps FOR INSERT TO anon, authenticated WITH CHECK (true);
