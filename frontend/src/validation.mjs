// Pure helper: rejects empty and whitespace-only titles.
export function isValidTitle(value) {
  return typeof value === "string" && value.trim().length > 0;
}
