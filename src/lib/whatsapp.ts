import { siteConfig } from "@/config/site";
import type { Product, QuoteItem } from "./types";

export function whatsappLink(message: string, number: string = siteConfig.contact.whatsapp) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export const productWhatsappMessage = (p: Pick<Product, "name" | "mpn">) =>
  `Hi, I would like to inquire about ${p.name} - Part #${p.mpn}. My required quantity is: `;

export function basketWhatsappMessage(items: QuoteItem[]) {
  const lines = items.map((i, n) => `${n + 1}. ${i.name} - Part #${i.mpn} - Qty: ${i.quantity}`);
  return `Hi, I would like a quotation for the following items:\n${lines.join("\n")}`;
}

export const sourcingWhatsappMessage = (query?: string) =>
  query
    ? `Hi, I could not find "${query}" on your website. Can you source and import it for me?`
    : "Hi, I need help sourcing a precision measuring tool or instrument. ";
