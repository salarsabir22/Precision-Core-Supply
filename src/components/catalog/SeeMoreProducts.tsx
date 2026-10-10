"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "../product/ProductCard";
import { Button } from "../ui/button";

const PAGE_SIZE = 12;

export function SeeMoreProducts({
  products,
  layout,
}: {
  products: Product[];
  layout: "grid" | "list";
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const key = products.map((p) => p.slug).join(",");

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [key]);

  const shown = products.slice(0, visible);
  const remaining = products.length - shown.length;

  return (
    <div>
      <ProductGrid products={shown} layout={layout} />
      {remaining > 0 && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <Button type="button" variant="outline" onClick={() => setVisible((n) => n + PAGE_SIZE)}>
            See more
          </Button>
          <p className="text-sm text-muted-foreground">
            Showing {shown.length} of {products.length}
          </p>
        </div>
      )}
    </div>
  );
}
