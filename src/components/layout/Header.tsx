import Link from "next/link";
import { NAV_LINKS, siteConfig } from "@/config/site";
import { categoryHref, categoryNav, topCategories } from "@/lib/catalog";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { QuoteLink } from "./QuoteLink";
import { SearchBar } from "./SearchBar";

export function Header() {
  const categories = categoryNav();
  const mobileLinks = [{ href: "/source", label: "Source a part" }, ...NAV_LINKS];
  const tel = siteConfig.contact.landline.replace(/[^\d+]/g, "");

  return (
    <header className="sticky top-0 z-30">
      <div className="bg-gold text-navy">
        <div className="mx-auto flex h-9 w-full max-w-6xl items-center justify-between gap-4 px-5 text-xs font-medium sm:px-8">
          <p className="truncate">{siteConfig.tagline}</p>
          <div className="hidden shrink-0 items-center gap-4 sm:flex">
            <a href={`tel:${tel}`} className="hover:underline">
              {siteConfig.contact.landline}
            </a>
            <a href={`mailto:${siteConfig.contact.publicEmail}`} className="hover:underline">
              {siteConfig.contact.publicEmail}
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-white">
        <div className="mx-auto grid h-16 w-full max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-5 sm:h-[4.25rem] sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
          <div className="justify-self-start">
            <Logo className="h-9 sm:h-11" />
          </div>
          <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-[15px] text-navy hover:text-gold">
                {l.label}
              </Link>
            ))}
            <Link href="/source" className="text-[15px] font-medium text-gold hover:underline">
              Source
            </Link>
          </nav>
          <div className="flex items-center justify-end gap-3">
            <div className="hidden min-w-0 w-full max-w-md md:block">
              <SearchBar id="site-search" />
            </div>
            <QuoteLink />
            <MobileNav links={mobileLinks} categories={categories} />
          </div>
        </div>
        <div className="px-5 pb-3 md:hidden">
          <SearchBar id="site-search-mobile" />
        </div>
      </div>

      <nav aria-label="Categories" className="hidden bg-navy md:block">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-x-5 gap-y-1 px-5 py-2.5 text-[13px] sm:px-8">
          {topCategories().map((c) => (
            <Link key={c.slug} href={categoryHref(c.slug)} className="text-white/75 hover:text-gold">
              {c.shortName ?? c.name}
            </Link>
          ))}
        </div>
      </nav>
      <div className="h-1 bg-gold" aria-hidden />
    </header>
  );
}
