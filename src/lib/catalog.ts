import raw from "@/data/products.generated.json";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import type { Brand, Category, Product } from "./types";

export const products: Product[] = raw as unknown as Product[];
export { brands, categories };

/** Every brand that has a page, including ones only reached from a product. */
export const knownBrands: Brand[] = brands;

const brandMap = new Map(knownBrands.map((b) => [b.slug, b]));
const categoryMap = new Map(categories.map((c) => [c.slug, c]));
const productMap = new Map(products.map((p) => [p.slug, p]));

export const getProduct = (slug: string) => productMap.get(slug);
export const getBrand = (slug: string): Brand | undefined => brandMap.get(slug);
export const getCategory = (slug: string): Category | undefined => categoryMap.get(slug);
export const brandName = (slug: string) => brandMap.get(slug)?.name ?? slug;

/* ----------------------------- Categories ----------------------------- */

export const topCategories = () => categories.filter((c) => !c.parent);
export const childCategories = (slug: string) => categories.filter((c) => c.parent === slug);

/** Ancestors first, the category itself last. */
export function categoryPath(slug: string): Category[] {
  const path: Category[] = [];
  let current = categoryMap.get(slug);
  while (current) {
    path.unshift(current);
    current = current.parent ? categoryMap.get(current.parent) : undefined;
  }
  return path;
}

export const categoryHref = (slug: string) =>
  `/category/${categoryPath(slug)
    .map((c) => c.slug)
    .join("/")}`;

export const categoryLabel = (slug: string) => {
  const category = categoryMap.get(slug);
  return category?.shortName ?? category?.name ?? slug;
};

export function parseView(params: Record<string, string | string[] | undefined>): "grid" | "list" {
  const value = Array.isArray(params.view) ? params.view[0] : params.view;
  return value === "list" ? "list" : "grid";
}

/** Builds catalogue query-string params so filters and view stay in the URL. */
export function catalogSearchParams(
  filters: Filters,
  extra: Record<string, string | undefined> = {},
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(extra)) {
    if (value) params.set(key, value);
  }
  filters.brands.forEach((value) => params.append("brand", value));
  filters.categories.forEach((value) => params.append("cat", value));
  for (const [key, values] of Object.entries(filters.specs)) {
    values.forEach((value) => params.append(`spec.${key}`, value));
  }
  return params;
}

const navQualifier: Record<string, string> = {
  hydraulics: "Hydraulic",
  pneumatics: "Pneumatic",
  "automation-control": "Automation",
  "test-measurement": "Test",
};

export type NavGroup = {
  href: string;
  label: string;
  children: { href: string; label: string }[];
};

/** Categories that products are filed under (no further children). */
function leafCategories(slug: string): Category[] {
  const children = childCategories(slug);
  if (children.length === 0) {
    const self = categoryMap.get(slug);
    return self ? [self] : [];
  }
  return children.flatMap((child) => leafCategories(child.slug));
}

/** Top-level categories, each with the product subcategories beneath it. */
export function categoryNav(): NavGroup[] {
  return topCategories().map((top) => ({
    href: categoryHref(top.slug),
    label: top.name,
    children: leafCategories(top.slug).map((leaf) => ({
      href: categoryHref(leaf.slug),
      label: leaf.name,
    })),
  }));
}

/**
 * Product subcategory links for the desktop bar. A name shared with another
 * category (both groups have "Valves") is prefixed so the links stay distinct.
 */
export function subcategoryNav(): { href: string; label: string }[] {
  const groups = topCategories().map((top) => ({
    slug: top.slug,
    leaves: leafCategories(top.slug),
  }));
  const counts = new Map<string, number>();
  for (const category of categories) counts.set(category.name, (counts.get(category.name) ?? 0) + 1);
  return groups.flatMap((group) =>
    group.leaves.map((leaf) => ({
      href: categoryHref(leaf.slug),
      label: (counts.get(leaf.name) ?? 0) > 1 ? `${navQualifier[group.slug] ?? group.slug} ${leaf.name}` : leaf.name,
    })),
  );
}

/** Resolves /category/a/b/c, verifying each segment is the child of the previous one. */
export function resolveCategory(segments: string[]): Category | undefined {
  let parent: string | undefined;
  let found: Category | undefined;
  for (const seg of segments) {
    found = categoryMap.get(seg);
    if (!found || found.parent !== parent) return undefined;
    parent = found.slug;
  }
  return found;
}

/** The category and every category beneath it. */
export function descendantSlugs(slug: string): string[] {
  const out = [slug];
  for (const child of childCategories(slug)) out.push(...descendantSlugs(child.slug));
  return out;
}

export function productsInCategory(slug: string): Product[] {
  const set = new Set(descendantSlugs(slug));
  return products.filter((p) => set.has(p.category));
}

export const productsByBrand = (slug: string) => products.filter((p) => p.brand === slug);

export function relatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.slug !== product.slug)
    .map((p) => ({
      p,
      score: (p.category === product.category ? 2 : 0) + (p.brand === product.brand ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

/* ------------------------------ Filtering ------------------------------ */

export type Filters = {
  brands: string[];
  categories: string[];
  /** spec key -> selected values */
  specs: Record<string, string[]>;
};

export const emptyFilters = (): Filters => ({ brands: [], categories: [], specs: {} });

export function filterProducts(list: Product[], f: Filters): Product[] {
  return list.filter((p) => {
    if (f.brands.length && !f.brands.includes(p.brand)) return false;
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    for (const [key, values] of Object.entries(f.specs)) {
      if (values.length && !values.includes(p.specs[key])) return false;
    }
    return true;
  });
}

export type FacetOption = { value: string; label: string; count: number };
export type Facets = {
  brands: FacetOption[];
  categories: FacetOption[];
  specs: { key: string; options: FacetOption[] }[];
};

const count = (list: Product[], pick: (p: Product) => string | undefined) => {
  const m = new Map<string, number>();
  for (const p of list) {
    const v = pick(p);
    if (v) m.set(v, (m.get(v) ?? 0) + 1);
  }
  return m;
};

/**
 * Builds the filter options for `base` (the unfiltered result set).
 * Counts for each facet reflect the *other* active filters, so a user never sees an
 * option that would lead to zero results.
 */
export function buildFacets(base: Product[], f: Filters): Facets {
  const without = (patch: Partial<Filters>) => filterProducts(base, { ...f, ...patch });

  const brandCounts = count(without({ brands: [] }), (p) => p.brand);
  const catCounts = count(without({ categories: [] }), (p) => p.category);

  const specKeys = new Map<string, Set<string>>();
  for (const p of base)
    for (const [k, v] of Object.entries(p.specs)) {
      if (!specKeys.has(k)) specKeys.set(k, new Set());
      specKeys.get(k)!.add(v);
    }

  const specs = [...specKeys.entries()]
    // Only keys that actually help narrow things down.
    .filter(([, values]) => values.size >= 2 && values.size <= 12)
    .map(([key, values]) => {
      const counts = count(without({ specs: { ...f.specs, [key]: [] } }), (p) => p.specs[key]);
      return {
        key,
        options: [...values]
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          .map((value) => ({ value, label: value, count: counts.get(value) ?? 0 })),
      };
    });

  const options = (src: Set<string>, counts: Map<string, number>, label: (s: string) => string) =>
    [...src]
      .map((value) => ({ value, label: label(value), count: counts.get(value) ?? 0 }))
      .sort((a, b) => a.label.localeCompare(b.label));

  return {
    brands: options(new Set(base.map((p) => p.brand)), brandCounts, brandName),
    categories: options(
      new Set(base.map((p) => p.category)),
      catCounts,
      categoryLabel,
    ),
    specs,
  };
}

/** Reads filters from URL search params (`brand`, `cat`, `spec.<Key>`). */
export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): Filters {
  const list = (v: string | string[] | undefined) =>
    v === undefined ? [] : Array.isArray(v) ? v : [v];
  const f = emptyFilters();
  f.brands = list(params.brand);
  f.categories = list(params.cat);
  for (const [k, v] of Object.entries(params)) {
    if (k.startsWith("spec.")) f.specs[k.slice(5)] = list(v);
  }
  return f;
}
