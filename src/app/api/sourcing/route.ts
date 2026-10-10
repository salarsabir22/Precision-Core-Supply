import { NextResponse } from "next/server";
import { fail, makeReference, readSubmission, type SubmitResponse } from "@/lib/api";
import { buildSourcingEmails } from "@/lib/emails";
import { sendPair } from "@/lib/mail";
import { validateSourcing } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const fd = await readSubmission(req);
  if (fd instanceof NextResponse) return fd;

  const result = validateSourcing(fd);
  if (!result.ok) return fail(422, "Please check the highlighted fields.", result.errors);

  const reference = makeReference("SRC");
  try {
    await sendPair(await buildSourcingEmails(reference, result.data));
  } catch (err) {
    console.error("[api/sourcing] delivery failed", err);
    return fail(503, "We could not send your request right now. Please contact us on WhatsApp or by phone.");
  }
  return NextResponse.json<SubmitResponse>({ ok: true, reference });
}
