import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Breadcrumbs, buttonClass, Container } from "@/components/shared";
import { categoryHref, topCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About us",
  description: `About ${siteConfig.name}: precision measuring tools and worldwide sourcing.`,
};

export default function AboutPage() {
  const { contact, address, hours } = siteConfig;
  const tel = contact.landline.replace(/[^\d+]/g, "");

  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About us" }]} />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <header className="border-l-4 border-gold bg-card px-5 py-6 sm:px-7">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-blue">Company</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">About {siteConfig.name}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {siteConfig.description} We keep a working catalogue for quotation and import the rest when a plant or lab
              needs a specific part.
            </p>
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <section className="bg-card p-5">
              <h2 className="text-lg font-semibold text-navy">What we supply</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Precision measuring tools, calibration instruments and industrial test equipment. Genuine parts, quoted
                against the manufacturer part number.
              </p>
              <Link href="/products" className="mt-4 inline-block text-sm font-semibold text-blue hover:underline">
                Open the product catalogue
              </Link>
            </section>
            <section className="bg-navy p-5 text-white">
              <h2 className="text-lg font-semibold">What we source</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{siteConfig.sourcing.intro}</p>
              <Link href="/source" className="mt-4 inline-block text-sm font-semibold text-gold hover:underline">
                Send a sourcing request
              </Link>
            </section>
          </div>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-navy">How an import moves</h2>
            <ol className="mt-4 divide-y divide-border border border-border bg-card">
              {siteConfig.sourcing.steps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[auto_1fr] gap-4 p-5">
                  <span className="font-mono text-xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold text-navy">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {siteConfig.sourcing.capabilities.map((item) => (
                <li key={item} className="bg-card px-4 py-3 text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-40">
          <section className="bg-card p-5">
            <h2 className="font-semibold text-navy">Visit or write</h2>
            <address className="mt-3 not-italic text-sm leading-relaxed text-muted-foreground">
              {address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <a href={`tel:${tel}`} className="text-navy hover:text-blue">
                  {contact.landline}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.publicEmail}`} className="text-navy hover:text-blue">
                  {contact.publicEmail}
                </a>
              </li>
            </ul>
            <Link href="/contact" className={buttonClass("outline", "default", "mt-5")}>
              Contact details
            </Link>
          </section>
          <section className="bg-card p-5">
            <h2 className="font-semibold text-navy">Hours</h2>
            <dl className="mt-3 space-y-2 text-sm">
              {hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 border-b border-border py-2 last:border-b-0">
                  <dt className="text-muted-foreground">{h.days}</dt>
                  <dd className="font-medium text-navy">{h.time}</dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-navy">Categories we cover</h2>
        <ul className="mt-4 grid gap-px bg-border sm:grid-cols-2">
          {topCategories().map((c) => (
            <li key={c.slug} className="bg-card">
              <Link href={categoryHref(c.slug)} className="block px-4 py-4 hover:bg-muted">
                <span className="font-medium text-navy">{c.shortName ?? c.name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{c.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
