-- =========================================================================
-- PROJECT DNA: SUPABASE DATABASE SCHEMA (PostgreSQL)
-- Platform for Discovering, Connecting, and Extending Student Projects
-- Kasetsart University Chalermphrakiat Sakon Nakhon Campus (KU CSC)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Faculties Table (4 คณะใน มก.ฉกส.)
CREATE TABLE IF NOT EXISTS faculties (
    id VARCHAR(50) PRIMARY KEY, -- e.g. "fac-kuse", "fac-fam", "fac-fnra", "fac-fph"
    name_th VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    color_hex VARCHAR(20) DEFAULT '#2563EB'
);

-- 2. Departments Table (ทุกสาขาวิชาใน มก.ฉกส.)
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,
    faculty_id VARCHAR(50) REFERENCES faculties(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL, -- e.g. "CPE", "CS", "IT", "ME", "EE", "CE", "MGT", "MKT", "AS", "PH"
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
    academic_year INT NOT NULL, -- e.g. 2568
    status VARCHAR(50) DEFAULT 'completed', -- 'completed', 'in_progress', 'incubating'
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
    asset_type VARCHAR(50) NOT NULL, -- 'code_repo', 'dataset', 'cad_blueprint', 'circuit_schematic', 'api', 'trained_model', 'document'
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
    category VARCHAR(50) NOT NULL, -- 'university', 'industry', 'community', 'regional'
    organization_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    description TEXT NOT NULL,
    pain_points TEXT[] DEFAULT '{}',
    desired_outputs TEXT[] DEFAULT '{}',
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(academic_year);
CREATE INDEX IF NOT EXISTS idx_lineage_parent ON project_lineages(parent_project_id);
CREATE INDEX IF NOT EXISTS idx_lineage_child ON project_lineages(child_project_id);
CREATE INDEX IF NOT EXISTS idx_assets_project ON reusable_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_gaps_project ON extension_gaps(project_id);
