export function slugify(s: string | null | undefined): string {
  if (!s) return '';
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}
