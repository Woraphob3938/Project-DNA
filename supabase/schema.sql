-- =========================================================================
-- PROJECT DNA: SUPABASE DATABASE SCHEMA (PostgreSQL)
-- Platform for Discovering, Connecting, and Extending Student Projects
-- SDGs-KUSE NONTRI E-SAN HACKATHON 2026
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SDGs Table
CREATE TABLE IF NOT EXISTS sdg_goals (
    id INT PRIMARY KEY,
    code VARCHAR(10) NOT NULL, -- e.g. "SDG 4"
    name_th VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    color_hex VARCHAR(20) NOT NULL,
    icon_name VARCHAR(50)
);

-- 2. Departments / Faculties Table
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL, -- e.g. "CPE", "CS", "ME", "EE"
    name_th VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    faculty VARCHAR(255) DEFAULT 'คณะวิทยาศาสตร์และวิศวกรรมศาสตร์'
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_th VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    abstract_th TEXT NOT NULL,
    abstract_en TEXT,
    academic_year INT NOT NULL, -- e.g. 2568
    status VARCHAR(50) DEFAULT 'completed', -- 'completed', 'in_progress', 'incubating'
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    cover_image_url TEXT,
    rating_score NUMERIC(3, 2) DEFAULT 4.8,
    view_count INT DEFAULT 0,
    fork_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DNA Cards (Structured Metadata for each project)
CREATE TABLE IF NOT EXISTS dna_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    problem_statement TEXT NOT NULL,
    target_users TEXT[] DEFAULT '{}',
    tech_stack TEXT[] DEFAULT '{}', -- e.g. ['Python', 'YOLOv8', 'FastAPI', 'Next.js', 'ESP32']
    key_outcomes TEXT[] DEFAULT '{}',
    limitations TEXT[] DEFAULT '{}',
    hardware_specs TEXT,
    dataset_description TEXT,
    repository_url TEXT,
    demo_url TEXT,
    advisor_name VARCHAR(255),
    student_authors JSONB DEFAULT '[]'::jsonb, -- Array of {name, student_id, role}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Reusable Assets Table
CREATE TABLE IF NOT EXISTS reusable_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL, -- 'code_repo', 'dataset', 'cad_blueprint', 'circuit_schematic', 'api', 'trained_model'
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    child_project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    extension_type VARCHAR(100) NOT NULL, -- 'feature_enhancement', 'hardware_upgrade', 'algorithm_optimization', 'domain_adaptation'
    evolution_summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_lineage_edge UNIQUE (parent_project_id, child_project_id)
);

-- 7. Extension Gaps (AI Identified Development Opportunities)
CREATE TABLE IF NOT EXISTS extension_gaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    gap_title VARCHAR(255) NOT NULL,
    gap_description TEXT NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'Medium', -- 'Easy', 'Medium', 'Hard'
    recommended_tech TEXT[] DEFAULT '{}',
    potential_impact TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Challenges (University, Industry, Community, SDG Problems)
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'university', 'industry', 'community', 'regional'
    organization_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    description TEXT NOT NULL,
    pain_points TEXT[] DEFAULT '{}',
    desired_outputs TEXT[] DEFAULT '{}',
    location VARCHAR(255), -- e.g. "จ.สกลนคร", "เขตพื้นที่ มก.ฉกส."
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'matched', 'in_progress', 'resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Project-to-SDG Junction Table
CREATE TABLE IF NOT EXISTS project_sdgs (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    sdg_id INT REFERENCES sdg_goals(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, sdg_id)
);

-- 10. Challenge-to-Project Matching Table
CREATE TABLE IF NOT EXISTS challenge_project_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    match_score NUMERIC(3, 2) DEFAULT 0.85,
    synergy_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_challenge_project UNIQUE (challenge_id, project_id)
);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(academic_year);
CREATE INDEX IF NOT EXISTS idx_lineage_parent ON project_lineages(parent_project_id);
CREATE INDEX IF NOT EXISTS idx_lineage_child ON project_lineages(child_project_id);
CREATE INDEX IF NOT EXISTS idx_assets_project ON reusable_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_gaps_project ON extension_gaps(project_id);
