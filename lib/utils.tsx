export function cleanServiceName(name?: string): string {
  if (!name) return "Wellness Experience";
  let cleaned = name.replace(/\b([A-Za-z]+)\s+\1\b/gi, "$1");
  cleaned = cleaned.replace(/sauna\s+sauna/gi, "Sauna");
  return cleaned.trim() || "Wellness Experience";
}
