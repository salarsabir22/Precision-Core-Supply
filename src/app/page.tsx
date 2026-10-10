import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import {
  ActivityIcon,
  CpuIcon,
  DropletsIcon,
  FlaskIcon,
  GaugeIcon,
  RadioIcon,
  ScanIcon,
  ShieldIcon,
  ThermometerIcon,
  ZapIcon,
} from "@/components/icons";
import { SearchBar } from "@/components/layout/SearchBar";
import { BrandCarousel } from "@/components/product/BrandCarousel";
import { ProductImage } from "@/components/product/ProductImage";
import { AddToQuoteButton } from "@/components/quote/AddToQuoteButton";
import { buttonClass, Container } from "@/components/shared";
import { brandName, brands, categoryHref, products, productsInCategory, topCategories } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const featured = products.slice(0, 6);
  const departments = topCategories();

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:py-16">
          <div>
            <h1 className="max-w-2xl text-4xl leading-[1.1] text-white sm:text-5xl">
              The part number is enough.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              {siteConfig.description} Search the catalogue, or send the number and we will import it.
            </p>
            <SearchBar size="lg" id="hero-search" tone="on-dark" className="mt-7 max-w-xl" />
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px]">
              <Link href="/products" className="font-medium text-white underline underline-offset-4">
                Browse catalogue
              </Link>
              <Link href="/source" className="text-white/75 hover:text-white">
                Source a part
              </Link>
            </div>
            <p className="mt-8 text-sm text-white/45">
              {products.length} products · {brands.length} brands · {departments.length} departments
            </p>
          </div>
          <ContactForm compact className="w-full" />
        </div>
      </section>

      <section className="bg-white">
        <Container className="py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl text-navy">Departments</h2>
              <p className="mt-2 max-w-lg text-sm text-navy/60">
                Browse by the bench you work on. Each department opens the parts we quote most often.
              </p>
            </div>
            <Link href="/products" className="text-sm font-medium text-gold hover:underline">
              All products
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {departments.map((c) => {
              const count = productsInCategory(c.slug).length;
              const Icon = departmentIcon(c.slug);
              return (
                <li key={c.slug}>
                  <Link
                    href={categoryHref(c.slug)}
                    className="group flex h-full flex-col bg-[#eef1f5] p-5 transition hover:bg-navy hover:text-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-11 place-items-center bg-white text-gold group-hover:bg-gold group-hover:text-navy">
                        <Icon width={22} height={22} strokeWidth={1.75} />
                      </span>
                      <span className="font-mono text-xs text-navy/45 group-hover:text-gold">
                        {count} {count === 1 ? "part" : "parts"}
                      </span>
                    </div>
                    <h3 className="mt-5 font-sans text-lg font-semibold text-navy group-hover:text-white">
                      {c.shortName ?? c.name}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-navy/60 group-hover:text-white/70">
                      {c.description}
                    </p>
                    <span className="mt-5 text-sm font-medium text-gold">
                      View products
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-12 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl text-navy">In the catalogue</h2>
              <p className="mt-1 text-sm text-navy/60">A short list of parts ready to quote.</p>
            </div>
            <Link href="/products" className="text-sm font-medium text-gold hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <li key={product.slug}>
                <CatalogueCard product={product} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-navy text-white">
        <Container className="grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <h2 className="max-w-md text-3xl text-white sm:text-4xl">If it is not listed, send the number.</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65">{siteConfig.sourcing.intro}</p>
            <Link href="/source" className={buttonClass("light", "default", "mt-7")}>
              Request a source
            </Link>
          </div>
          <ol className="space-y-6">
            {siteConfig.sourcing.steps.map((s) => (
              <li key={s.title}>
                <h3 className="font-sans text-base font-medium text-white">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="overflow-hidden bg-white py-16 lg:py-20">
        <Container className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl text-navy">Brands we supply</h2>
            <p className="mt-2 max-w-lg text-sm text-navy/60">
              Genuine parts from the manufacturers plants already specify. If yours is missing, send the number.
            </p>
          </div>
          <Link href="/brands" className="text-sm font-medium text-gold hover:underline">
            All brands
          </Link>
        </Container>
        <div className="space-y-8">
          <BrandCarousel brands={brands.slice(0, Math.ceil(brands.length / 2))} />
          <BrandCarousel brands={brands.slice(Math.ceil(brands.length / 2))} reverse />
        </div>
      </section>
    </>
  );
}

const departmentIcons = {
  "electrical-test": ZapIcon,
  "process-instrumentation": GaugeIcon,
  "industrial-automation": CpuIcon,
  "ppe-safety": ShieldIcon,
  "condition-monitoring": ActivityIcon,
  calibrators: ThermometerIcon,
  "rf-laboratory": RadioIcon,
  "mass-flow": DropletsIcon,
  "analytical-sensors": FlaskIcon,
  "remote-inspection": ScanIcon,
} as const;

function departmentIcon(slug: string) {
  return departmentIcons[slug as keyof typeof departmentIcons] ?? GaugeIcon;
}

function CatalogueCard({ product }: { product: Product }) {
  const href = `/products/${product.slug}`;
  const brand = brandName(product.brand);
  const spec = Object.entries(product.specs)[0];

  return (
    <article className="flex h-full flex-col bg-[#eef1f5] transition hover:bg-[#e6eaef]">
      <Link href={href} className="block bg-white">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          brand={brand}
          frame="wide"
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 360px"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-gold">{brand}</p>
          <p className="font-mono text-[11px] text-navy/40">{product.mpn}</p>
        </div>
        <h3 className="mt-1.5 line-clamp-2 font-sans text-[15px] font-semibold leading-snug text-navy">
          <Link href={href} className="hover:text-gold">
            {product.name}
          </Link>
        </h3>
        {spec && (
          <p className="mt-2 text-xs text-navy/50">
            {spec[0]} · {spec[1]}
          </p>
        )}
        <div className="mt-auto pt-3">
          <AddToQuoteButton product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}
