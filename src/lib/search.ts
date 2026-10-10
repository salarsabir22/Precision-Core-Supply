import { brandName, categoryPath, products } from "./catalog";
import type { Product } from "./types";

/** Lowercase and strip everything but letters and digits: "4WE6-D6X/EG24" -> "4we6d6xeg24". */
export const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

type Indexed = {
  product: Product;
  mpn: string;
  sku: string;
  brand: string;
  name: string;
  category: string;
  other: string;
};

const index: Indexed[] = products.map((product) => ({
  product,
  mpn: normalize(product.mpn),
  sku: normalize(product.sku),
  brand: normalize(brandName(product.brand)),
  name: normalize(product.name),
  category: normalize(
    categoryPath(product.category)
      .map((c) => c.name)
      .join(" "),
  ),
  other: normalize(`${product.description} ${Object.values(product.specs).join(" ")}`),
}));

/**
 * Part-number-first search.
 *
 * - Matches exact, prefix and partial MPN / SKU, ignoring spaces, dashes and slashes
 *   (so "D1VW 002" and "d1vw-002" both find "D1VW002CNJW").
 * - Matches brand names and words in the name, category, description and specs.
 * - Multi-word queries require every word to match somewhere.
 * - Results are ranked: exact part number > prefix > partial > brand > name > the rest.
 */
export function searchProducts(query: string, limit = 100): Product[] {
  const whole = normalize(query);
  if (!whole) return [];

  const tokens = query
    .toLowerCase()
    .split(/[\s,;]+/)
    .map(normalize)
    .filter(Boolean);

  const scored: { product: Product; score: number }[] = [];

  for (const e of index) {
    // Part-number match strength (0 = no match).
    let score = e.mpn === whole ? 1000
      : e.sku === whole ? 900
      : e.mpn.startsWith(whole) ? 700
      : e.mpn.includes(whole) ? 500
      : e.sku.includes(whole) ? 400
      : 0;
    const idMatch = score > 0;

    let allTokens = true;
    let tokenScore = 0;
    for (const t of tokens) {
      const w = e.mpn.includes(t)
        ? 60
        : e.brand.includes(t)
          ? 40
          : e.name.includes(t)
            ? 30
            : e.category.includes(t)
              ? 15
              : e.other.includes(t)
                ? 5
                : 0;
      if (!w) {
        allTokens = false;
        break;
      }
      tokenScore += w;
    }

    if (!idMatch && !allTokens) continue;
    if (allTokens) score += tokenScore;
    scored.push({ product: e.product, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .slice(0, limit)
    .map((s) => s.product);
}
