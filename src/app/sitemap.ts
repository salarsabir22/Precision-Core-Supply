import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { brands, categories, categoryHref, products } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;
  return [
    ...["", "/products", "/brands", "/source", "/about", "/contact", "/privacy", "/terms"].map((p) => ({ url: url(p) })),
    ...categories.map((c) => ({ url: url(categoryHref(c.slug)) })),
    ...brands.map((b) => ({ url: url(`/brands/${b.slug}`) })),
    ...products.map((p) => ({ url: url(`/products/${p.slug}`) })),
  ];
}
