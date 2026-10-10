import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/catalog/CatalogView";
import { SourcingCta } from "@/components/catalog/SourcingCta";
import { Breadcrumbs, Container, PageHeader } from "@/components/shared";
import {
  categories,
  categoryHref,
  categoryPath,
  childCategories,
  parseFilters,
  parseView,
  productsInCategory,
  resolveCategory,
} from "@/lib/catalog";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({
    slug: categoryPath(c.slug).map((x) => x.slug),
  }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const category = resolveCategory((await params).slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? `Browse ${category.name} products and request a quote.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = resolveCategory(slug);
  if (!category) notFound();

  const query = await searchParams;
  const filters = parseFilters(query);
  const view = parseView(query);
  const base = productsInCategory(category.slug);
  const children = childCategories(category.slug);
  const path = categoryPath(category.slug);
  const pathname = categoryHref(category.slug);

  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...path.slice(0, -1).map((c) => ({ label: c.name, href: categoryHref(c.slug) })),
          { label: category.name },
        ]}
      />
      <PageHeader title={category.name} intro={category.description} />

      {children.length > 0 && (
        <nav aria-label="Subcategories" className="mb-8">
          <ul className="flex flex-wrap gap-2">
            {children.map((c) => (
              <li key={c.slug}>
                <Link
                  href={categoryHref(c.slug)}
                  className="inline-flex h-9 items-center border border-border bg-card px-3 text-sm hover:bg-muted"
                >
                  {c.name}
                  <span className="ml-2 text-xs text-muted-foreground">{productsInCategory(c.slug).length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <CatalogView
        base={base}
        filters={filters}
        pathname={pathname}
        view={view}
        showCategories={children.length > 0}
        empty={
          base.length === 0 ? (
            <SourcingCta compact />
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
