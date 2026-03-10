export function sanitizeFileName(fileName: string): string {
  const extIndex = fileName.lastIndexOf('.');
  const name = extIndex >= 0 ? fileName.slice(0, extIndex) : fileName;
  const ext = extIndex >= 0 ? fileName.slice(extIndex).toLowerCase() : '';

  const safeName = name
    .normalize('NFKD')
    .replace(/[^\w\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  return `${safeName || 'file'}${ext}`;
}

export function buildFileKey(
  project: string,
  folder: string,
  originalName: string,
): string {
  const safeName = sanitizeFileName(originalName);
  const timestamp = Date.now();

  return `${project}/${folder}/${timestamp}-${safeName}`;
}