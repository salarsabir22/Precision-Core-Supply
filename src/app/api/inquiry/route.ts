import { NextResponse } from "next/server";
import { fail, makeReference, readSubmission, type SubmitResponse } from "@/lib/api";
import { buildRfqEmails } from "@/lib/emails";
import { sendPair } from "@/lib/mail";
import { validateRfq } from "@/lib/validation";

export const runtime = "nodejs";

/** Single-product inquiry and multi-item quote basket both post here. */
export async function POST(req: Request) {
  const fd = await readSubmission(req);
  if (fd instanceof NextResponse) return fd;

  const result = await validateRfq(fd);
  if (!result.ok) return fail(422, "Please check the highlighted fields.", result.errors);

  const reference = makeReference("RFQ");
  try {
    await sendPair(await buildRfqEmails(reference, result.data));
  } catch (err) {
    console.error("[api/inquiry] delivery failed", err);
    return fail(503, "We could not send your request right now. Please contact us on WhatsApp or by phone.");
  }
  return NextResponse.json<SubmitResponse>({ ok: true, reference });
}
