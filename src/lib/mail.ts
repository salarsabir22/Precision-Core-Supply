import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type OutboundEmail = {
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer }[];
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  EMAIL DELIVERY IS NOT CONNECTED YET.
 *
 *  This is the single place to plug in a real provider (SMTP via nodemailer,
 *  Resend, SendGrid, ...). Everything else — the templates in `emails.ts`, the
 *  sales + customer-confirmation flow, attachments — already calls `sendEmail`.
 *
 *  Until then each email is logged and the request is appended to
 *  `.data/outbox.jsonl` (git-ignored) so no inquiry is lost during development.
 *  Attachment *contents* are not stored, only their names and sizes.
 * ─────────────────────────────────────────────────────────────────────────
 */
export async function sendEmail(email: OutboundEmail): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Email delivery is not configured. Implement sendEmail() in src/lib/mail.ts.");
  }

  const { attachments, ...rest } = email;
  const record = {
    at: new Date().toISOString(),
    ...rest,
    attachments: attachments?.map((a) => ({ filename: a.filename, bytes: a.content.length })),
  };
  console.info(`[mail:stub] to=${email.to.join(",")} subject="${email.subject}"`);
  try {
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "outbox.jsonl"), JSON.stringify(record) + "\n");
  } catch (err) {
    console.warn("[mail:stub] could not write outbox file", err);
  }
}

/** Sends the internal alert first, then the customer confirmation. */
export async function sendPair(pair: { sales: OutboundEmail; customer: OutboundEmail }) {
  await sendEmail(pair.sales);
  // A failed confirmation must not make the whole submission look failed.
  await sendEmail(pair.customer).catch((err) => console.error("[mail] confirmation failed", err));
}
