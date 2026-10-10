import { siteConfig } from "@/config/site";
import { brandName } from "./catalog";
import type { OutboundEmail } from "./mail";
import type { ContactMessageInput, RfqInput, SourcingInput } from "./validation";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const row = (label: string, value: string) =>
  value
    ? `<tr><td style="padding:4px 12px 4px 0;color:#566176;vertical-align:top">${esc(label)}</td><td style="padding:4px 0">${esc(value).replace(/\n/g, "<br>")}</td></tr>`
    : "";

const wrap = (title: string, body: string) =>
  `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0f172a;max-width:640px"><h2 style="margin:0 0 12px">${esc(title)}</h2>${body}</div>`;

async function attachmentsOf(files: File[]) {
  return Promise.all(
    files.map(async (f) => ({ filename: f.name, content: Buffer.from(await f.arrayBuffer()) })),
  );
}

const footerText = `\n\n${siteConfig.name}\n${siteConfig.contact.publicEmail} | WhatsApp ${siteConfig.contact.whatsappDisplay}`;

export async function buildRfqEmails(reference: string, input: RfqInput) {
  const { contact: c, items, message, files } = input;
  const itemLines = items.map(
    (i, n) =>
      `${n + 1}. ${i.name}\n   Brand: ${brandName(i.brand)} | MPN: ${i.mpn} | SKU: ${i.sku} | Qty: ${i.quantity}${i.note ? `\n   Note: ${i.note}` : ""}`,
  );

  const sales: OutboundEmail = {
    to: [...siteConfig.contact.salesEmails],
    replyTo: c.email,
    subject: `[${reference}] New quote request from ${c.name}${c.company ? ` (${c.company})` : ""}`,
    text: `New quote request ${reference}\n\nName: ${c.name}\nCompany: ${c.company || "-"}\nEmail: ${c.email}\nPhone: ${c.phone}\nCountry: ${c.country || "-"}\n\nItems:\n${itemLines.join("\n")}\n\nMessage:\n${message || "-"}\n\nAttachments: ${files.map((f) => f.name).join(", ") || "none"}`,
    html: wrap(
      `New quote request ${reference}`,
      `<table>${row("Name", c.name)}${row("Company", c.company)}${row("Email", c.email)}${row("Phone", c.phone)}${row("Country", c.country)}</table>
       <h3>Requested items</h3>
       <table style="border-collapse:collapse;width:100%"><tr style="text-align:left;background:#eef1f6"><th style="padding:6px">Product</th><th style="padding:6px">Brand</th><th style="padding:6px">MPN</th><th style="padding:6px">SKU</th><th style="padding:6px">Qty</th></tr>
       ${items.map((i) => `<tr><td style="padding:6px;border-top:1px solid #d9dee7">${esc(i.name)}${i.note ? `<br><small>Note: ${esc(i.note)}</small>` : ""}</td><td style="padding:6px;border-top:1px solid #d9dee7">${esc(brandName(i.brand))}</td><td style="padding:6px;border-top:1px solid #d9dee7">${esc(i.mpn)}</td><td style="padding:6px;border-top:1px solid #d9dee7">${esc(i.sku)}</td><td style="padding:6px;border-top:1px solid #d9dee7">${i.quantity}</td></tr>`).join("")}</table>
       ${message ? `<h3>Message</h3><p>${esc(message).replace(/\n/g, "<br>")}</p>` : ""}`,
    ),
    attachments: await attachmentsOf(files),
  };

  const customer: OutboundEmail = {
    to: [c.email],
    subject: `We received your quote request (${reference})`,
    text: `Hello ${c.name},\n\nThank you for your inquiry. We have received your request ${reference} and our sales team will respond shortly.\n\nItems requested:\n${itemLines.join("\n")}${footerText}`,
    html: wrap(
      "We received your quote request",
      `<p>Hello ${esc(c.name)},</p><p>Thank you for your inquiry. Your reference is <strong>${esc(reference)}</strong>. Our sales team will respond shortly.</p>
       <ul>${items.map((i) => `<li>${esc(i.name)} (${esc(i.mpn)}) &times; ${i.quantity}</li>`).join("")}</ul>
       <p style="color:#566176">${esc(siteConfig.name)}<br>${esc(siteConfig.contact.publicEmail)} | WhatsApp ${esc(siteConfig.contact.whatsappDisplay)}</p>`,
    ),
  };

  return { sales, customer };
}

export async function buildSourcingEmails(reference: string, input: SourcingInput) {
  const { contact: c, files } = input;
  const details = [
    ["Part", input.partName],
    ["Brand", input.brand],
    ["Part / model number", input.partNumber],
    ["Quantity", String(input.quantity)],
    ["Needed by", input.deadline],
  ].filter(([, v]) => v);

  const sales: OutboundEmail = {
    to: [...siteConfig.contact.salesEmails],
    replyTo: c.email,
    subject: `[${reference}] Sourcing request: ${input.partName}`,
    text: `New sourcing request ${reference}\n\nName: ${c.name}\nCompany: ${c.company || "-"}\nEmail: ${c.email}\nPhone: ${c.phone}\nCountry: ${c.country || "-"}\n\n${details.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nDetails:\n${input.details || "-"}\n\nAttachments: ${files.map((f) => f.name).join(", ") || "none"}`,
    html: wrap(
      `New sourcing request ${reference}`,
      `<table>${row("Name", c.name)}${row("Company", c.company)}${row("Email", c.email)}${row("Phone", c.phone)}${row("Country", c.country)}</table>
       <h3>Part details</h3><table>${details.map(([k, v]) => row(k, v)).join("")}</table>
       ${input.details ? `<h3>Additional details</h3><p>${esc(input.details).replace(/\n/g, "<br>")}</p>` : ""}`,
    ),
    attachments: await attachmentsOf(files),
  };

  const customer: OutboundEmail = {
    to: [c.email],
    subject: `We received your sourcing request (${reference})`,
    text: `Hello ${c.name},\n\nThank you. We have received your sourcing request ${reference} for "${input.partName}". We will review it and come back to you with availability and a quotation.${footerText}`,
    html: wrap(
      "We received your sourcing request",
      `<p>Hello ${esc(c.name)},</p><p>Thank you. Your reference is <strong>${esc(reference)}</strong> for &ldquo;${esc(input.partName)}&rdquo;. We will review it and come back to you with availability and a quotation.</p>
       <p style="color:#566176">${esc(siteConfig.name)}<br>${esc(siteConfig.contact.publicEmail)} | WhatsApp ${esc(siteConfig.contact.whatsappDisplay)}</p>`,
    ),
  };

  return { sales, customer };
}

export function buildContactEmails(reference: string, input: ContactMessageInput) {
  const { contact: c, subject, message } = input;
  const title = subject || "General enquiry";

  const sales: OutboundEmail = {
    to: [...siteConfig.contact.salesEmails],
    replyTo: c.email,
    subject: `[${reference}] Website message: ${title}`,
    text: `New website message ${reference}\n\nName: ${c.name}\nCompany: ${c.company || "-"}\nEmail: ${c.email}\nPhone: ${c.phone || "-"}\nCountry: ${c.country || "-"}\n\nSubject: ${title}\n\n${message}`,
    html: wrap(
      `New website message ${reference}`,
      `<table>${row("Name", c.name)}${row("Company", c.company)}${row("Email", c.email)}${row("Phone", c.phone)}${row("Country", c.country)}${row("Subject", title)}</table>
       <h3>Message</h3><p>${esc(message).replace(/\n/g, "<br>")}</p>`,
    ),
  };

  const customer: OutboundEmail = {
    to: [c.email],
    subject: `We received your message (${reference})`,
    text: `Hello ${c.name},\n\nThank you for getting in touch. We have received your message ${reference} and will reply shortly.${footerText}`,
    html: wrap(
      "We received your message",
      `<p>Hello ${esc(c.name)},</p><p>Thank you for getting in touch. Your reference is <strong>${esc(reference)}</strong>. We will reply shortly.</p>
       <p style="color:#566176">${esc(siteConfig.name)}<br>${esc(siteConfig.contact.publicEmail)} | WhatsApp ${esc(siteConfig.contact.whatsappDisplay)}</p>`,
    ),
  };

  return { sales, customer };
}
