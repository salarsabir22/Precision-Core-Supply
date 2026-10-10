"use client";

import Link from "next/link";
import type { Brand } from "@/lib/types";
import { cn } from "../shared";
import { BrandMark } from "./BrandMark";

function BrandSlide({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group flex h-full flex-col items-center justify-center gap-3 px-2 text-center"
    >
      <span className="flex h-14 w-full items-center justify-center">
        <BrandMark brand={brand} className="max-h-12" />
      </span>
      <span className="line-clamp-1 text-sm text-navy/55 group-hover:text-gold">{brand.name}</span>
    </Link>
  );
}

export function BrandCarousel({
  brands,
  reverse = false,
}: {
  brands: Brand[];
  reverse?: boolean;
}) {
  const loop = [...brands, ...brands];

  return (
    <div className="overflow-hidden" aria-label={reverse ? undefined : "Brands we supply"}>
      <ul
        className={cn(
          "flex w-max gap-10 px-5 hover:[animation-play-state:paused]",
          reverse ? "animate-brand-marquee-reverse" : "animate-brand-marquee",
        )}
      >
        {loop.map((brand, i) => (
          <li
            key={`${brand.slug}-${i}`}
            className="w-36 shrink-0 sm:w-44"
            aria-hidden={i >= brands.length || undefined}
          >
            <BrandSlide brand={brand} />
          </li>
        ))}
      </ul>
    </div>
  );
}
