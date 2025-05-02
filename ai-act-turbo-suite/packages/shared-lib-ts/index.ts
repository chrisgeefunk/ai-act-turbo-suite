export function mapClause(section: string): string {
  // very naive mapping placeholder
  if (section.includes("bias")) return "Art10";
  return "AnnexIV";
}
