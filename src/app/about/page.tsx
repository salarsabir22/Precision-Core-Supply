import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Breadcrumbs, Container, PageHeader } from "@/components/shared";
import { categoryHref, topCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About us",
  description: `About ${siteConfig.name}: precision measuring tools and worldwide sourcing.`,
};

export default function AboutPage() {
  const { contact, address, hours } = siteConfig;
  const tel = contact.landline.replace(/[^\d+]/g, "");

  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About us" }]} />
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <PageHeader
            title={`About ${siteConfig.name}`}
            intro={`${siteConfig.description} We keep a working catalogue for quotation and import the rest when a plant or lab needs a specific part.`}
          />

          <div className="grid gap-10 sm:grid-cols-2">
            <section>
              <h2 className="text-2xl text-navy">What we supply</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Precision measuring tools, calibration instruments and industrial test equipment. Genuine parts, quoted
                against the manufacturer part number.
              </p>
              <Link href="/products" className="mt-4 inline-block text-sm text-navy underline underline-offset-4">
                Open the catalogue
              </Link>
            </section>
            <section>
              <h2 className="text-2xl text-navy">What we source</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{siteConfig.sourcing.intro}</p>
              <Link href="/source" className="mt-4 inline-block text-sm text-navy underline underline-offset-4">
                Send a sourcing request
              </Link>
            </section>
          </div>

          <section className="mt-14">
            <h2 className="text-2xl text-navy">How an import works</h2>
            <ol className="mt-6 max-w-xl space-y-6">
              {siteConfig.sourcing.steps.map((s) => (
                <li key={s.title}>
                  <h3 className="font-sans text-base font-medium text-navy">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>
            <ul className="mt-8 space-y-2 text-sm text-muted-foreground">
              {siteConfig.sourcing.capabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl text-navy">Departments</h2>
            <ul className="mt-6 grid border-t border-navy/10 sm:grid-cols-2">
              {topCategories().map((c) => (
                <li key={c.slug} className="border-b border-navy/10">
                  <Link href={categoryHref(c.slug)} className="block py-4 hover:text-navy sm:px-1">
                    <span className="font-sans text-sm font-medium text-navy">{c.shortName ?? c.name}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{c.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="text-sm lg:sticky lg:top-32">
          <h2 className="font-sans text-sm font-medium text-navy">Visit or write</h2>
          <address className="mt-3 not-italic leading-relaxed text-muted-foreground">
            {address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <ul className="mt-4 space-y-1">
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
          </ul>
          <h2 className="mt-8 font-sans text-sm font-medium text-navy">Hours</h2>
          <dl className="mt-3 space-y-2">
            {hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{h.days}</dt>
                <dd className="text-navy">{h.time}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </Container>
  );
}
