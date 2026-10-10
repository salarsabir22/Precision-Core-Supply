"use client";

import Link from "next/link";
import { useState } from "react";
import type { Brand } from "@/lib/types";
import { cn } from "../shared";

function monogram(name: string) {
  const letters = name.replace(/[^A-Za-z0-9]/g, "");
  return (letters.slice(0, 2) || name.slice(0, 2)).toUpperCase();
}

/** Brand logo if one is configured, otherwise a short monogram. The brand name is shown separately. */
export function BrandMark({ brand, className }: { brand: Brand; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!brand.logo || failed) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "grid h-8 min-w-8 place-items-center bg-muted px-1 font-mono text-[10px] font-bold tracking-wide",
          className,
        )}
      >
        {monogram(brand.name)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote wordmarks and local SVG logos
    <img
      src={brand.logo}
      alt=""
      width={96}
      height={32}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("max-h-8 w-auto max-w-full object-contain", className)}
    />
  );
}

/** Compact brand tile: logo above the name. No description and no product count. */
export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="flex h-full items-center gap-3 border border-border bg-card px-3 py-2.5 hover:bg-muted"
    >
      <span className="flex h-8 w-12 shrink-0 items-center justify-center">
        <BrandMark brand={brand} />
      </span>
      <span className="min-w-0 text-sm font-medium leading-tight">{brand.name}</span>
    </Link>
  );
}

export function BrandDirectory({ brands }: { brands: Brand[] }) {
  const groups = new Map<string, Brand[]>();
  for (const brand of brands) {
    const letter = (brand.name.match(/[A-Za-z]/)?.[0] ?? "#").toUpperCase();
    const list = groups.get(letter) ?? [];
    list.push(brand);
    groups.set(letter, list);
  }
  const letters = [...groups.keys()].sort();

  return (
    <div className="space-y-8">
      {letters.map((letter) => (
        <section key={letter}>
          <h3 className="mb-2 text-sm font-semibold text-navy">{letter}</h3>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {(groups.get(letter) ?? []).map((brand) => (
              <li key={brand.slug}>
                <BrandCard brand={brand} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
