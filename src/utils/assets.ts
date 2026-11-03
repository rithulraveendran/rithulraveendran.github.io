/**
 * Resolves static asset paths relative to Vite's configured BASE_URL.
 *
 * This ensures assets resolve properly across all deployment targets:
 * - Vercel root deployments (BASE_URL = '/')
 * - GitHub Pages user sites (BASE_URL = '/')
 * - GitHub Pages repository deployments (BASE_URL = '/repo-name/')
 *
 * @param path - Path to asset relative to public/ (e.g. 'assets/resume/resume.pdf' or '/assets/resume/resume.pdf')
 * @returns Fully qualified deployment-safe path
 */
export function getAssetPath(path: string): string {
  // Strip leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  return `${cleanBase}${cleanPath}`;
}
