import { NextResponse } from "next/server";
import { rateLimit } from "./rateLimit";
import type { FieldErrors } from "./validation";

export type SubmitResponse =
  | { ok: true; reference: string }
  | { ok: false; message: string; errors?: FieldErrors };

export const fail = (status: number, message: string, errors?: FieldErrors) =>
  NextResponse.json<SubmitResponse>({ ok: false, message, errors }, { status });

export function makeReference(prefix: "RFQ" | "SRC" | "MSG") {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${d}-${r}`;
}

/** Common pre-checks: rate limit, multipart parsing, honeypot. Returns FormData or a Response. */
export async function readSubmission(req: Request): Promise<FormData | NextResponse> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(ip)) return fail(429, "Too many requests. Please try again later.");

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return fail(400, "The form could not be read. Please try again.");
  }

  // Hidden field real users never fill. Pretend success so bots learn nothing.
  if (String(fd.get("website") ?? "").trim()) {
    return NextResponse.json<SubmitResponse>({ ok: true, reference: "RFQ-RECEIVED" });
  }
  return fd;
}
