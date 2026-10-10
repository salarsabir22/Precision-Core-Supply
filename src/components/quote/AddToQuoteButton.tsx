"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { CheckIcon, PlusIcon } from "../icons";
import { useQuote } from "./QuoteProvider";

type Props = {
  product: Pick<Product, "slug" | "name" | "sku" | "mpn" | "brand">;
  quantity?: number;
  size?: "sm" | "default" | "lg";
  className?: string;
};

export function AddToQuoteButton({ product, quantity = 1, size = "default", className }: Props) {
  const { add, has } = useQuote();
  const added = has(product.slug);

  return (
    <div className={className}>
      <Button
        type="button"
        onClick={() => add(product, quantity)}
        variant={added ? "outline" : "default"}
        size={size}
        className={size === "sm" ? "h-8 w-full px-2 text-xs" : "w-full"}
      >
        {added ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
        {added ? (size === "sm" ? "Added" : "Added – add more") : "Add to Quote"}
      </Button>
      {added && (
        <Link href="/quote" className="mt-1 block text-center text-sm text-navy underline underline-offset-2">
          View quote basket
        </Link>
      )}
    </div>
  );
}
