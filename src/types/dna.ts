// Types and Domain Models for Project DNA

export interface SdgGoal {
  id: number;
  code: string; // e.g. "SDG 4"
  name_th: string;
  name_en: string;
  color_hex: string;
  icon_name: string;
}

export interface Department {
  id: string;
  code: string; // "CS", "CPE", "ME", "EE", "CE"
  name_th: string;
  name_en: string;
  faculty: string;
}

export interface StudentAuthor {
  name: string;
  student_id: string;
  role: string;
  avatar_url?: string;
}

export interface ReusableAsset {
  id: string;
  project_id: string;
  asset_type: 'code_repo' | 'dataset' | 'cad_blueprint' | 'circuit_schematic' | 'api' | 'trained_model';
  title: string;
  description: string;
  resource_url: string;
  file_size?: string;
  license?: string;
  download_count: number;
}

export interface ExtensionGap {
  id: string;
  project_id: string;
  gap_title: string;
  gap_description: string;
  difficulty_level: 'Easy' | 'Medium' | 'Hard';
  recommended_tech: string[];
  potential_impact: string;
}

export interface DnaCardData {
  id: string;
  project_id: string;
  problem_statement: string;
  target_users: string[];
  tech_stack: string[];
  key_outcomes: string[];
  limitations: string[];
  hardware_specs?: string;
  dataset_description?: string;
  repository_url?: string;
  demo_url?: string;
  advisor_name?: string;
  student_authors: StudentAuthor[];
}

export interface ProjectLineageEdge {
  id: string;
  parent_project_id: string;
  child_project_id: string;
  extension_type: 'feature_enhancement' | 'hardware_upgrade' | 'algorithm_optimization' | 'domain_adaptation';
  evolution_summary: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: 'university' | 'industry' | 'community' | 'regional';
  organization_name: string;
  contact_person?: string;
  description: string;
  pain_points: string[];
  desired_outputs: string[];
  location: string;
  status: 'open' | 'matched' | 'in_progress' | 'resolved';
  matched_project_ids?: string[];
}

export interface Project {
  id: string;
  title_th: string;
  title_en: string;
  abstract_th: string;
  abstract_en?: string;
  academic_year: number;
  status: 'completed' | 'in_progress' | 'incubating';
  department_id: string;
  department?: Department;
  cover_image_url?: string;
  rating_score: number;
  view_count: number;
  fork_count: number;
  sdg_ids: number[];
  sdgs?: SdgGoal[];
  dna_card?: DnaCardData;
  assets?: ReusableAsset[];
  gaps?: ExtensionGap[];
  parent_lineages?: ProjectLineageEdge[];
  child_lineages?: ProjectLineageEdge[];
  matched_challenge_ids?: string[];
}

export type ActiveTab = 'explore' | 'lineage' | 'challenges' | 'analytics' | 'favorites';
