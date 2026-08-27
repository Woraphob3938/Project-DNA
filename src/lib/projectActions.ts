import type { DeleteProjectResult } from './dnaService';

export async function deleteProjectIfSuccessful(
  projectId: string,
  deleteProject: (projectId: string) => Promise<DeleteProjectResult>
): Promise<boolean> {
  return (await deleteProject(projectId)).deleted;
}
