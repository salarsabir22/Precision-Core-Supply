import type { Metadata } from "next";
import Link from "next/link";
import { CatalogView } from "@/components/catalog/CatalogView";
import { Breadcrumbs, Container, PageHeader } from "@/components/shared";
import { categoryHref, parseFilters, parseView, products, productsInCategory, topCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "All products",
  description: "Browse precision measuring tools, calibration instruments and industrial test equipment by brand and specification.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const view = parseView(params);

  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
      <PageHeader title="Products" intro="Filter by brand, category or specification, then add items to a quote." />
      <nav aria-label="Departments" className="mb-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {topCategories().map((c) => (
          <Link key={c.slug} href={categoryHref(c.slug)} className="text-navy/70 hover:text-navy">
            {c.shortName ?? c.name}
            <span className="ml-1.5 font-mono text-xs text-navy/40">{productsInCategory(c.slug).length}</span>
          </Link>
        ))}
      </nav>
      <CatalogView
        base={products}
        filters={filters}
        pathname="/products"
        view={view}
        empty={
          <>
            <p className="font-semibold">No products match these filters.</p>
            <Link href="/products" className="mt-2 inline-block text-navy underline underline-offset-2">
              Clear filters
            </Link>
          </>
        }
      />
    </Container>
  );
}
