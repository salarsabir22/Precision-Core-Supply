/** Shared by the browser (instant feedback) and the API routes (enforcement). */
export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = [
  "pdf", "jpg", "jpeg", "png", "webp", "xls", "xlsx", "csv", "doc", "docx",
  "dwg", "dxf", "step", "stp", "zip",
] as const;

export const ACCEPT_ATTR = ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",");

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Returns a human-readable error, or null when the file list is acceptable. */
export function validateFileList(files: { name: string; size: number }[]): string | null {
  if (files.length > MAX_FILES) return `Attach at most ${MAX_FILES} files.`;
  let total = 0;
  for (const f of files) {
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext))
      return `"${f.name}" is not an accepted file type.`;
    if (f.size > MAX_FILE_BYTES)
      return `"${f.name}" is larger than ${formatBytes(MAX_FILE_BYTES)}.`;
    total += f.size;
  }
  if (total > MAX_TOTAL_BYTES)
    return `Attachments are larger than ${formatBytes(MAX_TOTAL_BYTES)} in total.`;
  return null;
}
