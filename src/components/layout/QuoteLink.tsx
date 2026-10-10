"use client";

import Link from "next/link";
import { useQuote } from "../quote/QuoteProvider";

export function QuoteLink() {
  const { count, ready } = useQuote();
  return (
    <Link
      href="/quote"
      className="relative inline-flex h-9 items-center rounded-md bg-navy px-3.5 text-[13px] font-semibold text-white hover:bg-navy/90"
    >
      Quote
      {ready && count > 0 && (
        <span
          aria-hidden="true"
          className="ml-2 grid min-w-5 place-items-center rounded-sm bg-gold px-1 font-mono text-[11px] text-navy"
        >
          {count}
        </span>
      )}
      <span className="sr-only">
        {" "}
        list{ready && count > 0 ? `, ${count} ${count === 1 ? "item" : "items"}` : ", empty"}
      </span>
    </Link>
  );
}
