"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Facets, FacetOption, Filters } from "@/lib/catalog";
import { cn } from "../shared";

type Props = {
  facets: Facets;
  filters: Filters;
  pathname: string;
  /** Query params to keep when filters change (e.g. the search term). */
  preserve?: Record<string, string | undefined>;
  /** Hide the category facet when already inside a leaf category. */
  showCategories?: boolean;
};

type Group = { title: string; options: FacetOption[]; selected: string[]; onToggle: (v: string) => void };

export function FilterBar({ facets, filters, pathname, preserve = {}, showCategories = true }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const activeCount =
    filters.brands.length + filters.categories.length + Object.values(filters.specs).reduce((n, v) => n + v.length, 0);

  const push = (next: Filters) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(preserve)) {
      if (value) params.set(key, value);
    }
    next.brands.forEach((v) => params.append("brand", v));
    next.categories.forEach((v) => params.append("cat", v));
    for (const [k, vals] of Object.entries(next.specs)) vals.forEach((v) => params.append(`spec.${k}`, v));
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const groups: Group[] = [
    {
      title: "Brand",
      options: facets.brands,
      selected: filters.brands,
      onToggle: (v: string) => push({ ...filters, brands: toggle(filters.brands, v) }),
    },
    ...(showCategories && facets.categories.length > 1
      ? [
          {
            title: "Category",
            options: facets.categories,
            selected: filters.categories,
            onToggle: (v: string) => push({ ...filters, categories: toggle(filters.categories, v) }),
          },
        ]
      : []),
    ...facets.specs.map((s) => ({
      title: s.key,
      options: s.options,
      selected: filters.specs[s.key] ?? [],
      onToggle: (v: string) =>
        push({ ...filters, specs: { ...filters.specs, [s.key]: toggle(filters.specs[s.key] ?? [], v) } }),
    })),
  ].filter((g) => g.options.length > 1 || g.selected.length > 0); // a single option can't narrow anything

  if (groups.length === 0) return null;

  const panel = (
    <div className={cn("space-y-4", pending && "opacity-70")}>
      {activeCount > 0 && (
        <Button
          type="button"
          variant="link"
          size="xs"
          className="h-auto p-0"
          onClick={() => push({ brands: [], categories: [], specs: {} })}
        >
          Clear all filters ({activeCount})
        </Button>
      )}
      {groups.map((g, i) => (
        <div key={g.title}>
          {i > 0 && <Separator className="mb-4" />}
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-navy">{g.title}</legend>
            <ul className="space-y-0.5">
              {g.options.map((o) => {
                const checked = g.selected.includes(o.value);
                const disabled = !checked && o.count === 0;
                return (
                  <li key={o.value}>
                    <Label
                      className={cn(
                        "min-h-9 cursor-pointer gap-2.5 rounded-md px-1 font-normal hover:bg-muted",
                        disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
                      )}
                    >
                      <Checkbox checked={checked} disabled={disabled} onCheckedChange={() => g.onToggle(o.value)} />
                      <span className="flex-1">{o.label}</span>
                      <span className="text-xs text-muted-foreground">{o.count}</span>
                    </Label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        </div>
      ))}
      <p className="sr-only" role="status" aria-live="polite">
        {pending ? "Updating results" : "Results updated"}
      </p>
    </div>
  );

  return (
    <aside aria-label="Filters" className="lg:sticky lg:top-32 lg:w-64 lg:shrink-0">
      {/* Mobile: filters live in a slide-over sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger render={<Button variant="outline" className="w-full justify-between" />}>
            <span>Filters{activeCount > 0 && ` (${activeCount})`}</span>
            <span aria-hidden="true">+</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85%] max-w-sm">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-4 pb-6">{panel}</div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: always-visible sidebar card */}
      <div className="hidden border border-border bg-card p-4 lg:block">
        <h2 className="mb-3 font-mono text-xs text-navy/70">Narrow results</h2>
        {panel}
      </div>
    </aside>
  );
}
