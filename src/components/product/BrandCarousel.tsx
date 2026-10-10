"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import type { Brand } from "@/lib/types";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import { BrandMark } from "./BrandMark";

const INTERVAL_MS = 4500;

function BrandSlide({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group flex h-full flex-col items-center justify-center gap-2.5 px-2 py-1 text-center"
    >
      <span className="flex h-12 w-28 items-center justify-center">
        <BrandMark brand={brand} className="max-h-10" />
      </span>
      <span className="text-sm text-muted-foreground group-hover:text-navy">{brand.name}</span>
    </Link>
  );
}

export function BrandCarousel({ brands }: { brands: Brand[] }) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);

  const page = useCallback((dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.max(el.clientWidth * 0.7, 200);
    const max = el.scrollWidth - el.clientWidth;
    let next = el.scrollLeft + dir * delta;
    if (next > max - 8) next = 0;
    if (next < 0) next = max;
    el.scrollTo({ left: next, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      page(1);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [page]);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocusCapture={() => {
        pausedRef.current = true;
      }}
      onBlurCapture={() => {
        pausedRef.current = false;
      }}
    >
      <button
        type="button"
        aria-label="Previous brands"
        onClick={() => page(-1)}
        className="absolute left-0 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center text-navy/40 hover:text-navy"
      >
        <ChevronLeftIcon className="size-6" />
      </button>
      <button
        type="button"
        aria-label="Next brands"
        onClick={() => page(1)}
        className="absolute right-0 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center text-navy/40 hover:text-navy"
      >
        <ChevronRightIcon className="size-6" />
      </button>

      <ul
        ref={scrollerRef}
        aria-label="Brands we supply"
        className="flex min-w-0 gap-1 overflow-x-auto scroll-smooth px-10 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {brands.map((brand) => (
          <li key={brand.slug} className="w-[8.5rem] shrink-0 snap-start sm:w-40">
            <BrandSlide brand={brand} />
          </li>
        ))}
      </ul>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent"
      />
    </div>
  );
}
