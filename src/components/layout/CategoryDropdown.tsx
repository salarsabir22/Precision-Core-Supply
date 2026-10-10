"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "cn";
import { ChevronDownIcon } from "../icons";

type Item = { href: string; label: string };

export function CategoryDropdown({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const openedByHover = useRef(false);
  const pathname = usePathname();
  const panelId = useId();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close after navigation
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        openedByHover.current = true;
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        openedByHover.current = false;
        setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[13px] text-navy hover:bg-muted"
        onClick={() => {
          if (openedByHover.current) return;
          setOpen((value) => !value);
        }}
      >
        Categories
        <ChevronDownIcon className={cn("size-4", open && "rotate-180")} />
      </button>
      <div id={panelId} className={cn("absolute top-full left-0 z-50 pt-1", !open && "hidden")}>
        <ol className="w-[min(28rem,calc(100vw-2rem))] border border-border bg-card py-1 text-foreground shadow-sm">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn("block px-4 py-2 text-sm hover:bg-muted", active && "bg-muted font-medium")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
