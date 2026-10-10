import Link from "next/link";
import { brandName } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { cn } from "../shared";
import { AddToQuoteButton } from "../quote/AddToQuoteButton";
import { ProductImage } from "./ProductImage";

function previewSpecs(specs: Record<string, string>, limit = 2) {
  return Object.entries(specs).slice(0, limit);
}

export function ProductCard({
  product,
  layout = "list",
}: {
  product: Product;
  layout?: "list" | "grid";
}) {
  const href = `/products/${product.slug}`;
  const brand = brandName(product.brand);
  const specs = previewSpecs(product.specs, layout === "grid" ? 2 : 3);

  if (layout === "grid") {
    return (
      <article className="flex h-full flex-col border border-border bg-card">
        <div className="h-1 bg-gold" aria-hidden />
        <p className="px-4 pt-3 font-mono text-[11px] tracking-wide text-blue">{product.mpn}</p>
        <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            brand={brand}
            frame="card"
            sizes="(max-width: 640px) 92vw, (max-width: 1100px) 45vw, 280px"
            className="bg-white"
          />
        </Link>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-xs text-muted-foreground">{brand}</p>
          <h3 className="mt-1 text-sm leading-snug font-medium">
            <Link href={href} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          {specs.length > 0 && (
            <dl className="mt-3 space-y-1 font-mono text-[11px]">
              {specs.map(([key, value]) => (
                <div key={key} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-auto pt-3">
            <AddToQuoteButton product={product} size="sm" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="grid grid-cols-[4.75rem_1fr] items-center gap-4 border border-border border-l-4 border-l-gold bg-card p-3 sm:grid-cols-[5.5rem_1fr_auto] sm:p-4">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          brand={brand}
          frame="square"
          sizes="88px"
          className="bg-white"
        />
      </Link>
      <div className="min-w-0">
        <p className="font-mono text-[11px] text-blue">{product.mpn}</p>
        <h3 className="mt-0.5 text-sm leading-snug font-medium">
          <Link href={href} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {brand}
          {specs.length > 0 ? ` · ${specs.map(([, value]) => value).join(" · ")}` : ""}
        </p>
        <div className="mt-3 sm:hidden">
          <AddToQuoteButton product={product} size="sm" />
        </div>
      </div>
      <div className="hidden sm:block sm:w-36">
        <AddToQuoteButton product={product} size="sm" />
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  layout = "list",
  className,
}: {
  products: Product[];
  layout?: "list" | "grid";
  className?: string;
}) {
  return (
    <ul className={cn(layout === "grid" ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-2", className)}>
      {products.map((p) => (
        <li key={p.slug}>
          <ProductCard product={p} layout={layout} />
        </li>
      ))}
    </ul>
  );
}
