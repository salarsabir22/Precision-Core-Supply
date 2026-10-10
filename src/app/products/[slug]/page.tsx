import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { DownloadIcon } from "@/components/icons";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductGrid } from "@/components/product/ProductCard";
import { ProductImage } from "@/components/product/ProductImage";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Breadcrumbs, Container, SectionHeading } from "@/components/shared";
import {
  categoryHref,
  categoryPath,
  getBrand,
  getProduct,
  products,
  relatedProducts,
} from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const brand = getBrand(product.brand)?.name ?? "";
  return {
    title: `${brand} ${product.mpn} – ${product.name}`,
    description: product.description || `${product.name} (${product.mpn}). Request a quote.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const brand = getBrand(product.brand);
  const path = categoryPath(product.category);
  const related = relatedProducts(product);
  const specs = Object.entries(product.specs);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    mpn: product.mpn,
    description: product.description,
    brand: brand && { "@type": "Brand", name: brand.name },
    image: product.images.length ? product.images : undefined,
  };

  return (
    <Container className="py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...path.map((c) => ({ label: c.name, href: categoryHref(c.slug) })),
          { label: product.name },
        ]}
      />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,22rem)]">
        <div className="order-1 space-y-3 lg:order-2 lg:sticky lg:top-40">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            brand={brand?.name}
            frame="square"
            preload
            sizes="(max-width: 1024px) 92vw, 560px"
            className="border border-border bg-card"
          />
          {product.images.length > 1 && (
            <ul className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((src) => (
                <li key={src}>
                  <ProductImage src={src} alt="" frame="square" sizes="96px" className="rounded-lg border border-border" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="order-2 border-l-4 border-gold bg-card px-5 py-6 sm:px-6 lg:order-1">
          <div>
            <p className="font-mono text-xs text-blue">{product.mpn}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              <Link href={`/brands/${product.brand}`} className="hover:underline">
                {brand?.name ?? product.brand}
              </Link>
            </p>
            <h1 className="mt-2 text-2xl font-medium text-navy sm:text-3xl">{product.name}</h1>
          </div>

          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-muted-foreground">MPN</dt>
            <dd className="font-mono font-semibold">{product.mpn}</dd>
            <dt className="text-muted-foreground">SKU</dt>
            <dd className="font-mono">{product.sku}</dd>
            <dt className="text-muted-foreground">Category</dt>
            <dd>
              <Link href={categoryHref(product.category)} className="text-navy underline underline-offset-2">
                {path.at(-1)?.name}
              </Link>
            </dd>
          </dl>

          {product.description && <p className="mt-5 text-sm text-muted-foreground">{product.description}</p>}

          <div className="mt-6 border-t border-border pt-5">
            <ProductActions product={product} whatsappNumber={siteConfig.contact.whatsapp} />
          </div>

          <section aria-labelledby="datasheets" className="mt-6">
            <h2 id="datasheets" className="mb-2 font-mono text-xs text-navy/70">
              Technical documents
            </h2>
            {product.datasheets.length > 0 ? (
              <ul className="space-y-2">
                {product.datasheets.map((d) => (
                  <li key={d.url}>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <DownloadIcon width={18} height={18} />
                      {d.title}
                      <span className="sr-only"> (PDF, opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No datasheet uploaded yet. Request one with your quote and we’ll send it over.
              </p>
            )}
          </section>
        </div>
      </div>

      {specs.length > 0 && (
        <section aria-labelledby="specs" className="mt-12">
          <h2 id="specs" className="mb-4 font-mono text-xs text-navy/70">
            Specifications
          </h2>
          <div className="max-w-3xl overflow-hidden border border-border bg-card">
            <Table>
              <TableBody>
                {[...specs, ["Manufacturer Part No.", product.mpn] as [string, string]].map(([k, v]) => (
                  <TableRow key={k}>
                    <TableHead scope="row" className="w-1/3 bg-muted px-4 py-2.5">
                      {k}
                    </TableHead>
                    <TableCell className="whitespace-normal px-4 py-2.5">{v}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-14">
          <SectionHeading title="Related products" />
          <ProductGrid products={related} />
        </section>
      )}
    </Container>
  );
}
