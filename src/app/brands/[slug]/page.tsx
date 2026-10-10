import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/catalog/CatalogView";
import { SourcingCta } from "@/components/catalog/SourcingCta";
import { Breadcrumbs, Container, PageHeader } from "@/components/shared";
import { getBrand, knownBrands, parseFilters, parseView, productsByBrand } from "@/lib/catalog";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamicParams = false;

export const generateStaticParams = () => knownBrands.map((b) => ({ slug: b.slug }));

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const brand = getBrand((await params).slug);
  return brand ? { title: `${brand.name} products`, description: `${brand.name} parts and equipment – request a quote.` } : {};
}

export default async function BrandPage({ params, searchParams }: Props) {
  const brand = getBrand((await params).slug);
  if (!brand) notFound();

  const query = await searchParams;
  const filters = parseFilters(query);
  const view = parseView(query);
  const pathname = `/brands/${brand.slug}`;
  const base = productsByBrand(brand.slug);

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Brands", href: "/brands" }, { label: brand.name }]}
      />
      <PageHeader title={brand.name} intro={brand.description} />
      <CatalogView
        base={base}
        filters={{ ...filters, brands: [] }}
        pathname={pathname}
        view={view}
        empty={
          base.length === 0 ? (
            <SourcingCta compact query={brand.name} />
          ) : (
            <>
              <p className="font-semibold">No products match these filters.</p>
              <Link href={pathname} className="mt-2 inline-block text-navy underline underline-offset-2">
                Clear filters
              </Link>
            </>
          )
        }
      />
    </Container>
  );
}
