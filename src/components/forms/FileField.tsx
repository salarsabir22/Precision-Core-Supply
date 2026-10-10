"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaperclipIcon, CloseIcon } from "../icons";
import {
  ACCEPT_ATTR,
  ALLOWED_EXTENSIONS,
  MAX_FILES,
  MAX_FILE_BYTES,
  formatBytes,
  validateFileList,
} from "@/lib/uploadRules";

/**
 * Multi-file input that accumulates selections and lets users remove individual files.
 * The files live on the real <input name="files">, so `new FormData(form)` picks them up.
 */
export function FileField({
  label = "Attachments",
  hint,
  error,
}: {
  label?: string;
  hint?: string;
  error?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [localError, setLocalError] = useState("");

  const sync = (next: File[]) => {
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    if (inputRef.current) inputRef.current.files = dt.files;
    setFiles(next);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    const merged = [...files, ...picked.filter((p) => !files.some((f) => f.name === p.name && f.size === p.size))];
    const problem = validateFileList(merged);
    if (problem) {
      setLocalError(problem);
      sync(files); // keep the previous valid selection
      return;
    }
    setLocalError("");
    sync(merged);
  };

  const shownError = localError || error;

  return (
    <div>
      <Label htmlFor={id} className="mb-1.5">
        {label}
      </Label>
      <div className="rounded-lg border border-dashed border-input bg-muted/40 p-3">
        <Input
          ref={inputRef}
          id={id}
          type="file"
          name="files"
          multiple
          accept={ACCEPT_ATTR}
          onChange={onChange}
          aria-describedby={`${id}-hint`}
          aria-invalid={shownError ? true : undefined}
          className="h-auto cursor-pointer bg-card py-1.5 file:mr-3 file:h-7 file:rounded-md file:bg-muted file:px-3"
        />
        {files.length > 0 && (
          <ul className="mt-3 space-y-1" aria-label="Selected files">
            {files.map((f) => (
              <li key={`${f.name}-${f.size}`} className="flex items-center gap-2 text-sm">
                <PaperclipIcon size={16} className="shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{f.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(f.size)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => sync(files.filter((x) => x !== f))}
                  aria-label={`Remove ${f.name}`}
                >
                  <CloseIcon size={16} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">
        {hint ??
          `Drawings, datasheets or photos. Up to ${MAX_FILES} files, ${formatBytes(MAX_FILE_BYTES)} each (${ALLOWED_EXTENSIONS.slice(0, 8).join(", ")}, …).`}
      </p>
      {shownError && (
        <p role="alert" className="mt-1 text-sm text-destructive">
          {shownError}
        </p>
      )}
    </div>
  );
}
