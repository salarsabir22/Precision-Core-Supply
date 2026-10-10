"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Product, QuoteItem } from "@/lib/types";

const STORAGE_KEY = "pkpt.quote.v1";

type QuoteContextValue = {
  items: QuoteItem[];
  count: number;
  ready: boolean;
  has: (slug: string) => boolean;
  add: (p: Pick<Product, "slug" | "name" | "sku" | "mpn" | "brand">, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  setNote: (slug: string, note: string) => void;
  clear: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

function load(): QuoteItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as QuoteItem[]).filter((i) => i && typeof i.slug === "string") : [];
  } catch {
    return [];
  }
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  // Hydrate from localStorage after mount (avoids server/client markup mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from external storage
    setItems(load());
    setReady(true);
    // Keep multiple tabs in sync.
    const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && setItems(load());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = useCallback<QuoteContextValue["add"]>((p, quantity = 1) => {
    const qty = Math.max(1, Math.floor(quantity) || 1);
    setItems((prev) =>
      prev.some((i) => i.slug === p.slug)
        ? prev.map((i) => (i.slug === p.slug ? { ...i, quantity: i.quantity + qty } : i))
        : [...prev, { slug: p.slug, name: p.name, sku: p.sku, mpn: p.mpn, brand: p.brand, quantity: qty }],
    );
    // sonner renders an aria-live region, so screen readers are notified too.
    toast.success("Added to your quote", {
      description: p.name,
      action: { label: "View quote", onClick: () => router.push("/quote") },
    });
  }, [router]);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, quantity: Math.min(1_000_000, Math.max(1, Math.floor(quantity) || 1)) } : i)),
    );
  }, []);

  const setNote = useCallback((slug: string, note: string) => {
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, note: note.slice(0, 500) } : i)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<QuoteContextValue>(
    () => ({
      items,
      count: items.length,
      ready,
      has: (slug) => items.some((i) => i.slug === slug),
      add,
      remove,
      setQuantity,
      setNote,
      clear,
    }),
    [items, ready, add, remove, setQuantity, setNote, clear],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}
