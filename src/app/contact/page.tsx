import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { Breadcrumbs, buttonClass, Container } from "@/components/shared";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${siteConfig.name} by phone, WhatsApp or email.`,
};

export default function ContactPage() {
  const { contact, address, hours } = siteConfig;
  const tel = contact.landline.replace(/[^\d+]/g, "");

  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div className="grid items-start gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="bg-navy p-6 text-white lg:sticky lg:top-40">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">Desk</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Contact us</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Part enquiries, quotes and general questions. We usually reply within one business day.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex gap-3">
              <WhatsAppIcon className="mt-0.5 shrink-0" />
              <a
                href={whatsappLink("Hi, I need some help.", contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                WhatsApp {contact.whatsappDisplay}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li className="flex gap-3">
              <PhoneIcon className="mt-0.5 shrink-0" />
              <a href={`tel:${tel}`} className="hover:text-gold">
                {contact.landline}
              </a>
            </li>
            <li className="flex gap-3">
              <MailIcon className="mt-0.5 shrink-0" />
              <a href={`mailto:${contact.publicEmail}`} className="hover:text-gold">
                {contact.publicEmail}
              </a>
            </li>
            <li className="flex gap-3">
              <PinIcon className="mt-0.5 shrink-0" />
              <address className="not-italic text-white/75">{address.lines.join(", ")}</address>
            </li>
          </ul>
          <dl className="mt-6 space-y-2 border-t border-white/15 pt-5 text-sm">
            {hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-4">
                <dt className="text-white/60">{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/products" className={buttonClass("default", "default", "bg-gold text-navy hover:bg-gold/90")}>
              Browse products
            </Link>
            <Link href="/source" className={buttonClass("light")}>
              Source a part
            </Link>
          </div>
        </aside>

        <ContactForm />
      </div>
    </Container>
  );
}
