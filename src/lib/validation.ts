import { getProduct } from "./catalog";
import { validateFileList } from "./uploadRules";
import type { QuoteItem } from "./types";

export type FieldErrors = Record<string, string>;
export type Validated<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors };

export type Contact = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const text = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
};

function checkLength(errors: FieldErrors, key: string, value: string, label: string, max: number) {
  if (value.length > max) errors[key] = `${label} must be ${max} characters or fewer.`;
}

export function validateContact(
  fd: FormData,
  errors: FieldErrors,
  opts: { phoneRequired?: boolean } = {},
): Contact {
  const { phoneRequired = true } = opts;
  const c: Contact = {
    name: text(fd, "name"),
    company: text(fd, "company"),
    email: text(fd, "email"),
    phone: text(fd, "phone"),
    country: text(fd, "country"),
  };
  if (c.name.length < 2) errors.name = "Please enter your name.";
  checkLength(errors, "name", c.name, "Name", 100);
  checkLength(errors, "company", c.company, "Company", 150);
  if (!EMAIL_RE.test(c.email)) errors.email = "Please enter a valid email address.";
  checkLength(errors, "email", c.email, "Email", 200);
  if (!c.phone) {
    if (phoneRequired) errors.phone = "Please enter a phone or WhatsApp number.";
  } else if (!/^[+\d][\d\s().-]{5,24}$/.test(c.phone)) errors.phone = "Please enter a valid phone number.";
  checkLength(errors, "country", c.country, "Country", 80);
  return c;
}

export function validateAttachments(fd: FormData, errors: FieldErrors): File[] {
  const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const problem = validateFileList(files);
  if (problem) errors.files = problem;
  return files;
}

export type RfqInput = { contact: Contact; items: QuoteItem[]; message: string; files: File[] };

export async function validateRfq(fd: FormData): Promise<Validated<RfqInput>> {
  const errors: FieldErrors = {};
  const contact = validateContact(fd, errors);
  const message = text(fd, "message");
  checkLength(errors, "message", message, "Message", 3000);
  const files = validateAttachments(fd, errors);

  // Item details come from the catalog, never from the client, so they can't be spoofed.
  const items: QuoteItem[] = [];
  try {
    const parsed: unknown = JSON.parse(text(fd, "items") || "[]");
    if (!Array.isArray(parsed)) throw new Error("not an array");
    for (const row of parsed.slice(0, 50)) {
      const p = typeof row?.slug === "string" ? getProduct(row.slug) : undefined;
      if (!p) continue;
      const quantity = Number(row.quantity);
      const note = typeof row.note === "string" ? row.note.trim().slice(0, 500) : "";
      items.push({
        slug: p.slug,
        name: p.name,
        sku: p.sku,
        mpn: p.mpn,
        brand: p.brand,
        quantity: Number.isInteger(quantity) && quantity >= 1 && quantity <= 1_000_000 ? quantity : 1,
        note,
      });
    }
  } catch {
    errors.items = "Your quote list could not be read. Please try again.";
  }
  if (!items.length && !errors.items) errors.items = "Add at least one product to your quote.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: { contact, items, message, files } };
}

export type ContactMessageInput = { contact: Contact; subject: string; message: string };

/** General enquiry from the contact page / home hero. Phone is optional here. */
export function validateContactMessage(fd: FormData): Validated<ContactMessageInput> {
  const errors: FieldErrors = {};
  const contact = validateContact(fd, errors, { phoneRequired: false });
  const subject = text(fd, "subject");
  checkLength(errors, "subject", subject, "Subject", 150);
  const message = text(fd, "message");
  if (message.length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  checkLength(errors, "message", message, "Message", 3000);
  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, data: { contact, subject, message } };
}

export type SourcingInput = {
  contact: Contact;
  partName: string;
  brand: string;
  partNumber: string;
  quantity: number;
  deadline: string;
  details: string;
  files: File[];
};

export function validateSourcing(fd: FormData): Validated<SourcingInput> {
  const errors: FieldErrors = {};
  const contact = validateContact(fd, errors);

  const partName = text(fd, "partName");
  if (partName.length < 2) errors.partName = "Please describe the part you need.";
  checkLength(errors, "partName", partName, "Part name", 300);

  const brand = text(fd, "brand");
  checkLength(errors, "brand", brand, "Brand", 100);
  const partNumber = text(fd, "partNumber");
  checkLength(errors, "partNumber", partNumber, "Part number", 100);

  const quantity = Number(text(fd, "quantity"));
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1_000_000)
    errors.quantity = "Enter a quantity of 1 or more.";

  const deadline = text(fd, "deadline");
  if (deadline && Number.isNaN(Date.parse(deadline))) errors.deadline = "Enter a valid date.";

  const details = text(fd, "details");
  checkLength(errors, "details", details, "Details", 3000);
  const files = validateAttachments(fd, errors);

  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, data: { contact, partName, brand, partNumber, quantity, deadline, details, files } };
}
