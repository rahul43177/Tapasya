/**
 * Joins class names — avoids multiline JSX string hydration mismatches.
 * Use this for ALL className props in client components.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
