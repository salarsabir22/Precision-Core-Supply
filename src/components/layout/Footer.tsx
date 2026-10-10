import Link from "next/link";
import { NAV_LINKS, siteConfig } from "@/config/site";
import { categoryHref, topCategories } from "@/lib/catalog";
import { Container } from "../shared";
import { Logo } from "./Logo";

export function Footer() {
  const { contact, address, hours } = siteConfig;
  return (
    <footer className="mt-20 border-t border-border bg-white">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo className="h-12" />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{siteConfig.description}</p>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-blue">{siteConfig.tagline}</p>
        </div>

        <nav aria-label="Departments">
          <h2 className="mb-3 text-sm font-semibold text-navy">Catalogue</h2>
          <ul className="space-y-1.5 text-sm">
            {topCategories().map((c) => (
              <li key={c.slug}>
                <Link href={categoryHref(c.slug)} className="text-muted-foreground hover:text-blue">
                  {c.shortName ?? c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="mb-3 text-sm font-semibold text-navy">Company</h2>
          <ul className="space-y-1.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted-foreground hover:text-blue">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/source" className="text-muted-foreground hover:text-blue">
                Source a part
              </Link>
            </li>
            <li>
              <Link href="/quote" className="text-muted-foreground hover:text-blue">
                Quote basket
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-muted-foreground hover:text-blue">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-muted-foreground hover:text-blue">
                Terms
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-navy">Desk</h2>
          <address className="not-italic text-sm leading-relaxed text-muted-foreground">
            {address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <a href={`tel:${contact.landline.replace(/[^\d+]/g, "")}`} className="text-navy hover:text-blue">
                {contact.landline}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.publicEmail}`} className="text-navy hover:text-blue">
                {contact.publicEmail}
              </a>
            </li>
          </ul>
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            {hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="text-navy">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="bg-navy py-3 text-center text-xs text-white/70">
        © {new Date().getFullYear()} {siteConfig.name}
      </div>
    </footer>
  );
}
