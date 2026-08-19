import { Project, SdgGoal, Department, Challenge, ProjectLineageEdge, DnaCardData, ReusableAsset, ExtensionGap } from '../types/dna';
import { SEED_PROJECTS, SEED_SDGS, SEED_DEPARTMENTS, SEED_CHALLENGES, SEED_LINEAGES } from '../data/seedData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

class DnaService {
  private inMemoryProjects: Project[] = [...SEED_PROJECTS];
  private inMemoryChallenges: Challenge[] = [...SEED_CHALLENGES];
  private inMemoryLineages: ProjectLineageEdge[] = [...SEED_LINEAGES];

  // Get all SDGs
  async getSdgs(): Promise<SdgGoal[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('sdg_goals').select('*').order('id');
        if (!error && data && data.length > 0) return data as SdgGoal[];
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }
    return SEED_SDGS;
  }

  // Get all Departments
  async getDepartments(): Promise<Department[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('departments').select('*').order('code');
        if (!error && data && data.length > 0) return data as Department[];
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }
    return SEED_DEPARTMENTS;
  }

  // Get all Projects with full enriched relations
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: projData, error: projErr } = await supabase
          .from('projects')
          .select(`
            *,
            department:departments(*),
            dna_card:dna_cards(*),
            assets:reusable_assets(*),
            gaps:extension_gaps(*),
            project_sdgs(sdg_id)
          `);

        if (!projErr && projData && projData.length > 0) {
          return projData.map((p: any) => ({
            ...p,
            sdg_ids: p.project_sdgs ? p.project_sdgs.map((s: any) => s.sdg_id) : [],
            sdgs: SEED_SDGS.filter(sdg => (p.project_sdgs || []).some((ps: any) => ps.sdg_id === sdg.id))
          })) as Project[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }

    // Attach department and SDG objects to in-memory projects
    return this.inMemoryProjects.map(proj => ({
      ...proj,
      department: SEED_DEPARTMENTS.find(d => d.id === proj.department_id),
      sdgs: SEED_SDGS.filter(sdg => proj.sdg_ids.includes(sdg.id))
    }));
  }

  // Get Project By ID
  async getProjectById(id: string): Promise<Project | undefined> {
    const projects = await this.getProjects();
    return projects.find(p => p.id === id);
  }

  // Get Lineage Graph Edges
  async getLineages(): Promise<ProjectLineageEdge[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('project_lineages').select('*');
        if (!error && data && data.length > 0) return data as ProjectLineageEdge[];
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }
    return this.inMemoryLineages;
  }

  // Get Challenges
  async getChallenges(): Promise<Challenge[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('challenges').select('*');
        if (!error && data && data.length > 0) return data as Challenge[];
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }
    return this.inMemoryChallenges;
  }

  // Search & Filter Projects
  async searchProjects(query: string, sdgFilter?: number | null, deptFilter?: string | null): Promise<Project[]> {
    const all = await this.getProjects();
    const q = query.trim().toLowerCase();

    return all.filter(proj => {
      // SDG filter
      if (sdgFilter && !proj.sdg_ids.includes(sdgFilter)) {
        return false;
      }

      // Department filter
      if (deptFilter && proj.department_id !== deptFilter && proj.department?.code !== deptFilter) {
        return false;
      }

      // Query filter
      if (!q) return true;

      const titleTh = proj.title_th.toLowerCase();
      const titleEn = proj.title_en.toLowerCase();
      const abstractTh = proj.abstract_th.toLowerCase();
      const techStack = proj.dna_card?.tech_stack?.join(' ').toLowerCase() || '';
      const problem = proj.dna_card?.problem_statement?.toLowerCase() || '';
      const authorNames = proj.dna_card?.student_authors?.map(a => a.name.toLowerCase()).join(' ') || '';

      return (
        titleTh.includes(q) ||
        titleEn.includes(q) ||
        abstractTh.includes(q) ||
        techStack.includes(q) ||
        problem.includes(q) ||
        authorNames.includes(q)
      );
    });
  }

  // Create or Ingest New Project DNA
  async createProject(newProject: Partial<Project>): Promise<Project> {
    const id = 'proj-' + (this.inMemoryProjects.length + 1);
    const project: Project = {
      id,
      title_th: newProject.title_th || 'โครงงานนิสิตใหม่',
      title_en: newProject.title_en || 'New Student Project',
      abstract_th: newProject.abstract_th || '',
      abstract_en: newProject.abstract_en || '',
      academic_year: newProject.academic_year || 2568,
      status: newProject.status || 'in_progress',
      department_id: newProject.department_id || 'dept-cs',
      rating_score: 5.0,
      view_count: 1,
      fork_count: 0,
      sdg_ids: newProject.sdg_ids || [9],
      cover_image_url: newProject.cover_image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
      dna_card: newProject.dna_card,
      assets: newProject.assets || [],
      gaps: newProject.gaps || []
    };

    this.inMemoryProjects.unshift(project);

    // If Supabase is connected, attempt sync
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').insert({
          id: project.id,
          title_th: project.title_th,
          title_en: project.title_en,
          abstract_th: project.abstract_th,
          abstract_en: project.abstract_en,
          academic_year: project.academic_year,
          status: project.status,
          department_id: project.department_id,
          cover_image_url: project.cover_image_url
        });
      } catch (e) {
        console.warn('Supabase insert failed:', e);
      }
    }

    return project;
  }
}

export const dnaService = new DnaService();
