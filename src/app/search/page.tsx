import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { SourcingCta } from "@/components/catalog/SourcingCta";
import { SearchBar } from "@/components/layout/SearchBar";
import { Breadcrumbs, Container, PageHeader } from "@/components/shared";
import { parseFilters, parseView } from "@/lib/catalog";
import { searchProducts } from "@/lib/search";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim().slice(0, 100) ?? "";
  const filters = parseFilters(params);
  const view = parseView(params);
  const matches = q ? searchProducts(q) : [];

  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <PageHeader
        title={q ? `Results for “${q}”` : "Search products"}
        intro="Search by part number (full or partial), brand or product name."
      />
      <SearchBar defaultValue={q} className="mb-8 max-w-2xl" id="search-page-input" />

      {!q && <p className="text-muted-foreground">Enter a part number or brand above to get started.</p>}

      {q && matches.length === 0 && (
        <div role="status" aria-label="No results">
          <p className="mb-6 text-lg">
            No products found for <strong>“{q}”</strong>.
          </p>
          <SourcingCta query={q} />
        </div>
      )}

      {q && matches.length > 0 && (
        <>
          <CatalogView
            base={matches}
            filters={filters}
            pathname="/search"
            preserve={{ q }}
            view={view}
            empty={<p className="font-semibold">No results match these filters.</p>}
          />
          <div className="mt-12">
            <SourcingCta query={q} compact />
          </div>
        </>
      )}
    </Container>
  );
}
