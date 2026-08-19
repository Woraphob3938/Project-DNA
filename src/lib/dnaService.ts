import { Project, Faculty, Department, Challenge, ProjectLineageEdge } from '../types/dna';
import { SEED_PROJECTS, SEED_FACULTIES, SEED_DEPARTMENTS, SEED_CHALLENGES, SEED_LINEAGES } from '../data/seedData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

class DnaService {
  private inMemoryProjects: Project[] = [...SEED_PROJECTS];
  private inMemoryFaculties: Faculty[] = [...SEED_FACULTIES];
  private inMemoryDepartments: Department[] = [...SEED_DEPARTMENTS];
  private inMemoryChallenges: Challenge[] = [...SEED_CHALLENGES];
  private inMemoryLineages: ProjectLineageEdge[] = [...SEED_LINEAGES];

  // Get all Faculties of KU Sakon Nakhon
  async getFaculties(): Promise<Faculty[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('faculties').select('*');
        if (!error && data && data.length > 0) return data as Faculty[];
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }
    return this.inMemoryFaculties;
  }

  // Get all Departments with Faculty attached
  async getDepartments(): Promise<Department[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('departments').select('*, faculty:faculties(*)');
        if (!error && data && data.length > 0) return data as Department[];
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }
    return this.inMemoryDepartments.map(d => ({
      ...d,
      faculty: this.inMemoryFaculties.find(f => f.id === d.faculty_id)
    }));
  }

  // Get all Projects with full enriched relations
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: projData, error: projErr } = await supabase
          .from('projects')
          .select(`
            *,
            department:departments(*, faculty:faculties(*)),
            dna_card:dna_cards(*),
            assets:reusable_assets(*),
            gaps:extension_gaps(*)
          `);

        if (!projErr && projData && projData.length > 0) {
          return projData as Project[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }

    // Attach department and faculty objects to in-memory projects
    return this.inMemoryProjects.map(proj => {
      const dept = this.inMemoryDepartments.find(d => d.id === proj.department_id);
      const faculty = dept ? this.inMemoryFaculties.find(f => f.id === dept.faculty_id) : undefined;
      return {
        ...proj,
        department: dept ? { ...dept, faculty } : undefined
      };
    });
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

  // Search & Filter Projects by Faculty & Department
  async searchProjects(query: string, facultyFilter?: string | null, deptFilter?: string | null): Promise<Project[]> {
    const all = await this.getProjects();
    const q = query.trim().toLowerCase();

    return all.filter(proj => {
      // Faculty filter
      if (facultyFilter && proj.department?.faculty_id !== facultyFilter) {
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
    const dept = this.inMemoryDepartments.find(d => d.id === newProject.department_id) || this.inMemoryDepartments[0];
    const faculty = this.inMemoryFaculties.find(f => f.id === dept.faculty_id);

    const project: Project = {
      id,
      title_th: newProject.title_th || 'โครงงานนิสิต มก.ฉกส.',
      title_en: newProject.title_en || 'KUSE Student Project',
      abstract_th: newProject.abstract_th || '',
      abstract_en: newProject.abstract_en || '',
      academic_year: newProject.academic_year || 2568,
      status: newProject.status || 'in_progress',
      department_id: dept.id,
      department: { ...dept, faculty },
      rating_score: 5.0,
      view_count: 1,
      fork_count: 0,
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
