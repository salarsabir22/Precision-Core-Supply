import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { ArrowRightIcon } from "@/components/icons";
import { SearchBar } from "@/components/layout/SearchBar";
import { BrandMark } from "@/components/product/BrandMark";
import { ProductImage } from "@/components/product/ProductImage";
import { AddToQuoteButton } from "@/components/quote/AddToQuoteButton";
import { buttonClass, Container, SectionHeading } from "@/components/shared";
import { brandName, brands, categoryHref, products, productsInCategory, topCategories } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const featured = products.slice(0, 6);

  return (
    <>
      <section className="border-b border-border bg-white">
        <Container className="grid items-center gap-10 py-12 lg:grid-cols-[1.25fr_0.85fr] lg:py-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue">Precision Core Supply</p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
              Measuring tools, quoted by part number.
            </h1>
            <span className="mt-5 block h-1 w-16 bg-gold" aria-hidden />
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              {siteConfig.description} Search the catalogue, or send the part number and we will import it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className={buttonClass("default", "default", "bg-gold text-navy hover:bg-gold/90")}>
                Browse products
              </Link>
              <Link href="/source" className={buttonClass("outline")}>
                Source a part
              </Link>
            </div>
          </div>

          <div className="bg-navy p-5 text-white sm:p-7">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">Find a part</p>
            <p className="mt-2 text-lg font-semibold">Search the catalogue</p>
            <div className="mt-4">
              <SearchBar size="lg" id="hero-search" tone="on-dark" />
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-5">
              <div>
                <dt className="font-mono text-[11px] uppercase text-white/55">Products</dt>
                <dd className="mt-1 text-2xl font-semibold">{products.length}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase text-white/55">Brands</dt>
                <dd className="mt-1 text-2xl font-semibold">{brands.length}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase text-white/55">Categories</dt>
                <dd className="mt-1 text-2xl font-semibold">{topCategories().length}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 lg:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-blue">Catalogue</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy">Shop by category</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Choose a department. Each card shows what it covers and how many parts are ready to quote.
              </p>
            </div>
            <Link href="/products" className={buttonClass("outline")}>
              All products
              <ArrowRightIcon width={16} height={16} />
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {topCategories().map((c, i) => {
              const count = productsInCategory(c.slug).length;
              return (
                <li key={c.slug}>
                  <Link
                    href={categoryHref(c.slug)}
                    className="group flex h-full flex-col bg-white p-5 ring-1 ring-border transition hover:ring-gold"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid size-9 place-items-center bg-navy font-mono text-xs text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-xs text-blue">
                        {count} {count === 1 ? "product" : "products"}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-navy group-hover:text-blue">
                      {c.shortName ?? c.name}
                    </h3>
                    <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-blue">
                      Open category
                      <ArrowRightIcon width={16} height={16} className="transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="border-y border-border bg-white">
        <Container className="py-12 lg:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-blue">Featured</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy">On the bench</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Six parts kept in front of the desk. Open a card for specifications, or add it straight to a quote.
              </p>
            </div>
            <Link href="/products" className={buttonClass("outline")}>
              View all products
              <ArrowRightIcon width={16} height={16} />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <li key={product.slug} className="h-full">
                <BenchCard product={product} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section>
        <Container className="py-12 lg:py-16">
          <div className="grid overflow-hidden border border-border lg:grid-cols-2">
            <div className="bg-navy p-8 text-white lg:p-12">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">Import</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Not listed? We can bring it in.</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{siteConfig.sourcing.intro}</p>
              <Link href="/source" className={buttonClass("default", "default", "mt-6 bg-gold text-navy hover:bg-gold/90")}>
                Send a sourcing request
              </Link>
            </div>
            <ol className="divide-y divide-border bg-card">
              {siteConfig.sourcing.steps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[auto_1fr] gap-4 p-6 sm:p-8">
                  <span className="font-mono text-2xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold text-navy">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-white">
        <Container className="py-12 lg:py-16">
          <SectionHeading
            title="Brands on the wall"
            intro="If a manufacturer is missing, send the part number and we will look for it."
            action={
              <Link href="/brands" className="text-sm font-semibold text-blue hover:underline">
                All brands
              </Link>
            }
          />
          <ul className="grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {brands.slice(0, 18).map((b) => (
              <li key={b.slug} className="border-r border-b border-border">
                <Link href={`/brands/${b.slug}`} className="flex h-full flex-col items-center gap-2 px-3 py-4 hover:bg-muted">
                  <span className="flex h-8 items-center justify-center">
                    <BrandMark brand={b} />
                  </span>
                  <span className="block w-full truncate text-center text-xs text-muted-foreground">{b.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section>
        <Container className="grid items-start gap-10 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-blue">Desk</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy">Ask for a part</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Quotes, sourcing and general questions come to the same desk. We usually reply within one business day.
            </p>
            <dl className="mt-6 space-y-2 text-sm">
              {siteConfig.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 border-b border-border py-2">
                  <dt className="text-muted-foreground">{h.days}</dt>
                  <dd className="font-medium text-navy">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}

function BenchCard({ product }: { product: Product }) {
  const href = `/products/${product.slug}`;
  const brand = brandName(product.brand);
  const specs = Object.entries(product.specs).slice(0, 2);

  return (
    <article className="flex h-full flex-col bg-card ring-1 ring-border transition hover:ring-gold">
      <div className="h-1 bg-gold" aria-hidden />
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block bg-[#f6f8fa]">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          brand={brand}
          frame="card"
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 360px"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold tracking-wide text-blue uppercase">{brand}</p>
        <h3 className="mt-1 text-base leading-snug font-semibold text-navy">
          <Link href={href} className="hover:text-blue">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 font-mono text-xs text-muted-foreground">{product.mpn}</p>
        {specs.length > 0 && (
          <dl className="mt-3 space-y-1 border-t border-border pt-3 text-xs">
            {specs.map(([key, value]) => (
              <div key={key} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{key}</dt>
                <dd className="text-right font-medium text-navy">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-auto pt-4">
          <AddToQuoteButton product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}
