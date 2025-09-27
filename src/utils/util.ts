export function getAvatarFallback(fullName: string): string {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0].toUpperCase());

  return initials.join("");
}