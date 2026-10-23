/**
 * Domain utility formatters for candidate and screening data
 */

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function formatInitials(name: string): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatYears(years: number): string {
  return years === 1 ? "1 yr" : `${years} yrs`;
}

export function formatTimestamp(ts: string | number | Date): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
