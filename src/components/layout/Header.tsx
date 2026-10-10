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
    <header className="sticky top-0 z-30 bg-white">
      <div className="bg-navy text-white">
        <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
          <p className="truncate tracking-wide text-white/80">{siteConfig.tagline}</p>
          <div className="hidden shrink-0 items-center gap-4 sm:flex">
            <a href={`tel:${tel}`} className="hover:text-gold">
              {siteConfig.contact.landline}
            </a>
            <a href={`mailto:${siteConfig.contact.publicEmail}`} className="hover:text-gold">
              {siteConfig.contact.publicEmail}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.25rem] items-center gap-3 lg:gap-5">
          <Logo className="h-10 sm:h-12" />
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="px-2.5 py-2 text-sm text-navy hover:text-blue">
                {l.label}
              </Link>
            ))}
            <Link href="/source" className="px-2.5 py-2 text-sm font-semibold text-blue hover:underline">
              Source
            </Link>
          </nav>
          <div className="ml-auto hidden min-w-0 flex-1 md:block md:max-w-xs xl:max-w-sm">
            <SearchBar id="site-search" />
          </div>
          <QuoteLink />
          <MobileNav links={mobileLinks} categories={categories} />
        </div>
        <div className="pb-3 md:hidden">
          <SearchBar id="site-search-mobile" />
        </div>
      </div>

      <nav aria-label="Categories" className="border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-2 px-4 py-2 sm:px-6 lg:px-8">
          {topCategories().map((c) => (
            <Link
              key={c.slug}
              href={categoryHref(c.slug)}
              className="bg-white px-3 py-1.5 text-[13px] text-navy hover:text-blue"
            >
              {c.shortName ?? c.name}
            </Link>
          ))}
        </div>
      </nav>
      <div className="h-[3px] bg-gold" aria-hidden />
    </header>
  );
}
