export const FILE_PROJECTS = ['marketline', 'marketline-dev'] as const;
export type FileProject = (typeof FILE_PROJECTS)[number];

export const PROJECT_FOLDERS: Record<FileProject, readonly string[]> = {
  marketline: ['products', 'user-avatar', 'company-logo'],
  'marketline-dev': ['products', 'user-avatar', 'company-logo'],
} as const;
