import Link from "next/link";
import { NAV_LINKS, siteConfig } from "@/config/site";
import { categoryHref, topCategories } from "@/lib/catalog";
import { Container } from "../shared";
import { Logo } from "./Logo";

export function Footer() {
  const { contact, address, hours } = siteConfig;
  return (
    <footer className="mt-24 bg-navy text-white">
      <div className="h-1.5 bg-gold" aria-hidden />
      <Container className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
        <div>
          <Logo inverted className="h-11" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">{siteConfig.description}</p>
          <p className="mt-4 text-xs font-medium tracking-wide text-gold">{siteConfig.tagline}</p>
        </div>

        <nav aria-label="Catalogue">
          <h2 className="mb-4 font-sans text-sm font-semibold text-gold">Catalogue</h2>
          <ul className="space-y-2 text-sm">
            {topCategories().map((c) => (
              <li key={c.slug}>
                <Link href={categoryHref(c.slug)} className="text-white/70 hover:text-gold">
                  {c.shortName ?? c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="mb-4 font-sans text-sm font-semibold text-gold">Company</h2>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/70 hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/source" className="text-white/70 hover:text-gold">
                Source a part
              </Link>
            </li>
            <li>
              <Link href="/quote" className="text-white/70 hover:text-gold">
                Quote basket
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-white/70 hover:text-gold">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-white/70 hover:text-gold">
                Terms
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold text-gold">Contact</h2>
          <address className="not-italic text-sm leading-relaxed text-white/70">
            {address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <a href={`tel:${contact.landline.replace(/[^\d+]/g, "")}`} className="text-white hover:text-gold">
                {contact.landline}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.publicEmail}`} className="text-white hover:text-gold">
                {contact.publicEmail}
              </a>
            </li>
          </ul>
          <ul className="mt-5 space-y-1 text-sm text-white/55">
            {hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="text-white/80">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="bg-gold py-3 text-center text-xs font-medium text-navy">
        © {new Date().getFullYear()} {siteConfig.name}
      </div>
    </footer>
  );
}
