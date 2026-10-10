import Link from "next/link";
import {
  brandName,
  catalogSearchParams,
  categoryLabel,
  type Filters,
  buildFacets,
  filterProducts,
} from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { GridIcon, ListIcon } from "../icons";
import { cn } from "../shared";
import { FilterBar } from "./FilterBar";
import { SeeMoreProducts } from "./SeeMoreProducts";

function hrefFor(pathname: string, params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

/** Filter sidebar + result grid, shared by the products, category, brand and search pages. */
export function CatalogView({
  base,
  filters,
  pathname,
  preserve,
  showCategories,
  view = "grid",
  empty,
}: {
  base: Product[];
  filters: Filters;
  pathname: string;
  preserve?: Record<string, string>;
  showCategories?: boolean;
  view?: "grid" | "list";
  empty: React.ReactNode;
}) {
  const facets = buildFacets(base, filters);
  const results = filterProducts(base, filters);
  const extra = { ...preserve, view: view === "list" ? "list" : undefined };
  const chips = [
    ...filters.brands.map((value) => ({
      key: `brand-${value}`,
      label: brandName(value),
      href: hrefFor(
        pathname,
        catalogSearchParams({ ...filters, brands: filters.brands.filter((item) => item !== value) }, extra),
      ),
    })),
    ...filters.categories.map((value) => ({
      key: `cat-${value}`,
      label: categoryLabel(value),
      href: hrefFor(
        pathname,
        catalogSearchParams(
          { ...filters, categories: filters.categories.filter((item) => item !== value) },
          extra,
        ),
      ),
    })),
    ...Object.entries(filters.specs).flatMap(([key, values]) =>
      values.map((value) => ({
        key: `spec-${key}-${value}`,
        label: `${key}: ${value}`,
        href: hrefFor(
          pathname,
          catalogSearchParams(
            { ...filters, specs: { ...filters.specs, [key]: values.filter((item) => item !== value) } },
            extra,
          ),
        ),
      })),
    ),
  ];

  return (
    <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-start">
      <FilterBar
        facets={facets}
        filters={filters}
        pathname={pathname}
        preserve={extra}
        showCategories={showCategories}
      />
      <section aria-label="Results" className="min-w-0 flex-1">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>
          <div className="inline-flex border border-border bg-card" role="group" aria-label="Result layout">
            <Link
              href={hrefFor(pathname, catalogSearchParams(filters, { ...preserve }))}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 px-3 text-sm",
                view === "grid" ? "bg-gold text-navy" : "text-navy hover:bg-muted",
              )}
              aria-current={view === "grid" ? "page" : undefined}
            >
              <GridIcon className="size-4" />
              Grid
            </Link>
            <Link
              href={hrefFor(pathname, catalogSearchParams(filters, { ...preserve, view: "list" }))}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 border-l border-border px-3 text-sm",
                view === "list" ? "bg-gold text-navy" : "text-navy hover:bg-muted",
              )}
              aria-current={view === "list" ? "page" : undefined}
            >
              <ListIcon className="size-4" />
              List
            </Link>
          </div>
        </div>

        {chips.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip.key}>
                <Link
                  href={chip.href}
                  className="inline-flex h-8 items-center gap-2 border border-border bg-card px-2.5 text-sm text-navy hover:bg-muted"
                >
                  {chip.label}
                  <span aria-hidden="true" className="text-muted-foreground">
                    ×
                  </span>
                  <span className="sr-only">Remove {chip.label} filter</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {results.length > 0 ? (
          <SeeMoreProducts products={results} layout={view} />
        ) : (
          <div className="border border-border bg-card p-6">{empty}</div>
        )}
      </section>
    </div>
  );
}
