export function slugify(s: string): string {
  return s.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}
