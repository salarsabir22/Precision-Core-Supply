import { NextResponse } from "next/server";
import { fail, makeReference, readSubmission, type SubmitResponse } from "@/lib/api";
import { buildContactEmails } from "@/lib/emails";
import { sendPair } from "@/lib/mail";
import { validateContactMessage } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const fd = await readSubmission(req);
  if (fd instanceof NextResponse) return fd;

  const result = validateContactMessage(fd);
  if (!result.ok) return fail(422, "Please check the highlighted fields.", result.errors);

  const reference = makeReference("MSG");
  try {
    await sendPair(buildContactEmails(reference, result.data));
  } catch (err) {
    console.error("[api/contact] delivery failed", err);
    return fail(503, "We could not send your message right now. Please contact us on WhatsApp or by phone.");
  }
  return NextResponse.json<SubmitResponse>({ ok: true, reference });
}
