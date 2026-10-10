import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumbs, Container, PageHeader } from "@/components/shared";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${siteConfig.name} by phone, WhatsApp or email.`,
};

export default function ContactPage() {
  const { contact, address, hours } = siteConfig;
  const tel = contact.landline.replace(/[^\d+]/g, "");

  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        <div>
          <PageHeader
            title="Contact"
            intro="Part enquiries, quotes and general questions. We usually reply within one business day."
          />
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={whatsappLink("Hi, I need some help.", contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy hover:underline"
              >
                WhatsApp {contact.whatsappDisplay}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={`tel:${tel}`} className="text-navy hover:underline">
                {contact.landline}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.publicEmail}`} className="text-navy hover:underline">
                {contact.publicEmail}
              </a>
            </li>
            <li>
              <address className="not-italic text-muted-foreground">{address.lines.join(", ")}</address>
            </li>
          </ul>
          <dl className="mt-8 space-y-2 text-sm">
            {hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{h.days}</dt>
                <dd className="text-navy">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
