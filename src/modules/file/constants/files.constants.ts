export const FILE_PROJECTS = ['suppliers', 'marketline', 'hb2b'] as const;
export type FileProject = (typeof FILE_PROJECTS)[number];

export const PROJECT_FOLDERS: Record<FileProject, readonly string[]> = {
  suppliers: ['products', 'documents'],
  marketline: ['user', 'products', 'company'],
  hb2b: ['temp'],
} as const;
