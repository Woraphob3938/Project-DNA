import { Project, Faculty, Department, Challenge, ProjectLineageEdge } from '../types/dna';
import { SEED_PROJECTS, SEED_FACULTIES, SEED_DEPARTMENTS, SEED_CHALLENGES, SEED_LINEAGES } from '../data/seedData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

/** Where a read's data came from — lets the UI warn when falling back to seeds. */
export type DataSource = 'unknown' | 'supabase' | 'seed';

class DnaService {
  private inMemoryProjects: Project[] = [...SEED_PROJECTS];
  private inMemoryFaculties: Faculty[] = [...SEED_FACULTIES];
  private inMemoryDepartments: Department[] = [...SEED_DEPARTMENTS];
  private inMemoryChallenges: Challenge[] = [...SEED_CHALLENGES];
  private inMemoryLineages: ProjectLineageEdge[] = [...SEED_LINEAGES];

  private lastFetchSource: DataSource = 'unknown';
  private lastSyncWarning: string | null = null;

  /** Where the most recent read came from ('seed' = DB unreachable). */
  getDataSource(): DataSource {
    return this.lastFetchSource;
  }

  /** Non-fatal message from the most recent write attempt, if any. */
  getLastSyncWarning(): string | null {
    return this.lastSyncWarning;
  }

  getInitialProjects(): Project[] {
    return this.inMemoryProjects.map(proj => {
      const dept = this.inMemoryDepartments.find(d => d.id === proj.department_id);
      const faculty = dept ? this.inMemoryFaculties.find(f => f.id === dept.faculty_id) : undefined;
      return {
        ...proj,
        department: dept ? { ...dept, faculty } : undefined
      };
    });
  }

  getInitialFaculties(): Faculty[] {
    return this.inMemoryFaculties;
  }

  getInitialDepartments(): Department[] {
    return this.inMemoryDepartments.map(d => ({
      ...d,
      faculty: this.inMemoryFaculties.find(f => f.id === d.faculty_id)
    }));
  }

  getInitialChallenges(): Challenge[] {
    return this.inMemoryChallenges;
  }

  getInitialLineages(): ProjectLineageEdge[] {
    return this.inMemoryLineages;
  }

  // Get all Faculties of KU Sakon Nakhon
  async getFaculties(): Promise<Faculty[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('faculties').select('*');
        if (!error && data && data.length > 0) {
          this.lastFetchSource = 'supabase';
          return data as Faculty[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }
    this.lastFetchSource = 'seed';
    return this.inMemoryFaculties;
  }

  // Get all Departments with Faculty attached
  async getDepartments(): Promise<Department[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('departments').select('*, faculty:faculties(*)');
        if (!error && data && data.length > 0) {
          this.lastFetchSource = 'supabase';
          return data as Department[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }
    this.lastFetchSource = 'seed';
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
          this.lastFetchSource = 'supabase';
          return projData as Project[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }

    // Attach department and faculty objects to in-memory projects
    this.lastFetchSource = 'seed';
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
        if (!error && data && data.length > 0) {
          this.lastFetchSource = 'supabase';
          return data as ProjectLineageEdge[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }
    this.lastFetchSource = 'seed';
    return this.inMemoryLineages;
  }

  // Get Challenges
  async getChallenges(): Promise<Challenge[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('challenges').select('*');
        if (!error && data && data.length > 0) {
          this.lastFetchSource = 'supabase';
          return data as Challenge[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to seed data:', e);
      }
    }
    this.lastFetchSource = 'seed';
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
    // Timestamp-based id — `length + 1` produces duplicate ids whenever rows
    // are removed or two browsers create projects at the same time.
    const id = 'proj-' + Date.now().toString(36);
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

    // Mutating this singleton is only safe in the browser, where every
    // visitor gets their own instance. On the server it is shared across ALL
    // requests and must stay read-only.
    if (typeof window !== 'undefined') {
      this.inMemoryProjects.unshift(project);
    }

    // If Supabase is connected, sync full relational records
    if (isSupabaseConfigured && supabase) {
      this.lastSyncWarning = null;
      try {
        // Stamp ownership with the signed-in user (RLS enforces this too)
        const { data: userData } = await supabase.auth.getUser();
        const ownerId = userData.user?.id;

        await supabase.from('projects').insert({
          id: project.id,
          title_th: project.title_th,
          title_en: project.title_en,
          abstract_th: project.abstract_th,
          abstract_en: project.abstract_en,
          academic_year: project.academic_year,
          status: project.status,
          department_id: project.department_id,
          cover_image_url: project.cover_image_url,
          ...(ownerId ? { owner_id: ownerId } : {})
        });

        if (project.dna_card) {
          await supabase.from('dna_cards').insert({
            id: 'dna-' + project.id,
            project_id: project.id,
            problem_statement: project.dna_card.problem_statement || '',
            target_users: project.dna_card.target_users || [],
            tech_stack: project.dna_card.tech_stack || [],
            key_outcomes: project.dna_card.key_outcomes || [],
            limitations: project.dna_card.limitations || [],
            hardware_specs: project.dna_card.hardware_specs || '',
            dataset_description: project.dna_card.dataset_description || '',
            repository_url: project.dna_card.repository_url || '',
            demo_url: project.dna_card.demo_url || '',
            advisor_name: project.dna_card.advisor_name || '',
            student_authors: project.dna_card.student_authors || []
          });
        }

        if (project.assets && project.assets.length > 0) {
          const assetRows = project.assets.map((a, i) => ({
            id: a.id || `asset-${project.id}-${i + 1}`,
            project_id: project.id,
            asset_type: a.asset_type,
            title: a.title,
            description: a.description || '',
            resource_url: a.resource_url,
            file_size: a.file_size || '',
            license: a.license || 'MIT / Open Academic'
          }));
          await supabase.from('reusable_assets').insert(assetRows);
        }

        if (project.gaps && project.gaps.length > 0) {
          const gapRows = project.gaps.map((g, i) => ({
            id: g.id || `gap-${project.id}-${i + 1}`,
            project_id: project.id,
            gap_title: g.gap_title,
            gap_description: g.gap_description,
            difficulty_level: g.difficulty_level || 'Medium',
            recommended_tech: g.recommended_tech || [],
            potential_impact: g.potential_impact
          }));
          await supabase.from('extension_gaps').insert(gapRows);
        }
      } catch (e) {
        this.lastSyncWarning = e instanceof Error ? e.message : String(e);
        console.warn('Supabase insert failed:', e);
      }
    }

    return project;
  }

  // Owner edit — merge a patch over an existing project and sync to Supabase.
  // Returns the updated project, or null when the id is unknown.
  async updateProject(
    projectId: string,
    patch: Partial<Pick<Project, 'title_th' | 'title_en' | 'abstract_th' | 'abstract_en' | 'academic_year' | 'status'>> & {
      dna_card?: Partial<Pick<NonNullable<Project['dna_card']>,
        'problem_statement' | 'tech_stack' | 'key_outcomes' | 'limitations' |
        'advisor_name' | 'repository_url' | 'demo_url' | 'dataset_description'>>;
    }
  ): Promise<Project | null> {
    const all = await this.getProjects();
    const existing = all.find(p => p.id === projectId);
    if (!existing) return null;

    this.lastSyncWarning = null;

    const { dna_card: dnaPatch, ...topPatch } = patch;
    const updated: Project = {
      ...existing,
      ...topPatch,
      dna_card: existing.dna_card
        ? { ...existing.dna_card, ...(dnaPatch || {}) }
        : existing.dna_card
    };

    // Keep the browser-side cache fresh (client-only mutation)
    if (typeof window !== 'undefined') {
      const i = this.inMemoryProjects.findIndex(p => p.id === projectId);
      if (i >= 0) this.inMemoryProjects[i] = updated;
    }

    // Sync to Supabase when configured
    if (isSupabaseConfigured && supabase) {
      try {
        // `.select()` makes PostgREST return the affected rows so a silent
        // RLS drop (0 rows matched = no permission) is detectable.
        let query = supabase
          .from('projects')
          .update({
            title_th: updated.title_th,
            title_en: updated.title_en,
            abstract_th: updated.abstract_th,
            abstract_en: updated.abstract_en,
            academic_year: updated.academic_year,
            status: updated.status
          })
          .eq('id', projectId)
          .select();

        const { data: updRows, error: updErr } = await query;
        if (updErr) throw updErr;

        if (!updRows || updRows.length === 0) {
          this.lastSyncWarning = 'ไม่มีสิทธิ์แก้ไขโครงงานนี้ในฐานข้อมูล (ไม่ใช่เจ้าของ)';
        }

        if (updated.dna_card) {
          await supabase.from('dna_cards').update({
            problem_statement: updated.dna_card.problem_statement || '',
            tech_stack: updated.dna_card.tech_stack || [],
            key_outcomes: updated.dna_card.key_outcomes || [],
            limitations: updated.dna_card.limitations || [],
            advisor_name: updated.dna_card.advisor_name || '',
            repository_url: updated.dna_card.repository_url || '',
            demo_url: updated.dna_card.demo_url || '',
            dataset_description: updated.dna_card.dataset_description || ''
          }).eq('project_id', projectId);
        }
      } catch (e) {
        this.lastSyncWarning = e instanceof Error ? e.message : String(e);
        console.warn('Supabase update failed:', e);
      }
    }

    return updated;
  }

  /**
   * Delete a project and every related row (dna_card, assets, gaps,
   * lineage edges). RLS delete policies scope each removal to the project
   * owner, so a non-owner's delete silently affects 0 rows — detected via
   * the returned row count.
   */
  async deleteProject(projectId: string): Promise<{ deleted: boolean; warning: string | null }> {
    this.lastSyncWarning = null;

    // Remove from the browser-side cache immediately (client-only mutation)
    if (typeof window !== 'undefined') {
      this.inMemoryProjects = this.inMemoryProjects.filter(p => p.id !== projectId);
    }

    if (!isSupabaseConfigured || !supabase) {
      // Demo mode: in-memory removal is all we can do
      return { deleted: true, warning: null };
    }

    try {
      // Children first so orphan rows never linger if a later step fails
      await supabase.from('extension_gaps').delete().eq('project_id', projectId);
      await supabase.from('reusable_assets').delete().eq('project_id', projectId);
      await supabase.from('dna_cards').delete().eq('project_id', projectId);
      await supabase
        .from('project_lineages')
        .delete()
        .or(`parent_project_id.eq.${projectId},child_project_id.eq.${projectId}`);

      const { data, error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        this.lastSyncWarning = 'ไม่มีสิทธิ์ลบโครงงานนี้ในฐานข้อมูล (ไม่ใช่เจ้าของ)';
        return { deleted: false, warning: this.lastSyncWarning };
      }
      return { deleted: true, warning: null };
    } catch (e) {
      this.lastSyncWarning = e instanceof Error ? e.message : String(e);
      console.warn('Supabase delete failed:', e);
      return { deleted: false, warning: this.lastSyncWarning };
    }
  }

  // Ids of projects owned by the signed-in user. Returns [] when Supabase is
  // unavailable or nobody is signed in — callers fall back to the local
  // ownership registry in that case.
  async getOwnedProjectIds(): Promise<string[]> {
    if (!isSupabaseConfigured || !supabase) return [];

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) return [];

    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .eq('owner_id', userData.user.id);

    if (error || !data) return [];
    return data.map(row => row.id as string);
  }
}

export const dnaService = new DnaService();
