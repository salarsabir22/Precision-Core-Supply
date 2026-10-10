"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "../icons";
import { Logo } from "./Logo";

type L = { href: string; label: string };
type Group = { href: string; label: string; children: L[] };

export function MobileNav({ links, categories }: { links: readonly L[]; categories: Group[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close after navigating.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset UI on route change
    setOpen(false);
  }, [pathname]);

  const linkClass = "block rounded-md px-3 py-2.5 hover:bg-muted";

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="outline" size="icon" className="border-navy/15 bg-white text-navy" />}>
          <MenuIcon />
          <span className="sr-only">Open menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85%] max-w-sm">
          <SheetHeader>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Logo className="h-10" />
          </SheetHeader>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 pb-6">
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={`${linkClass} font-semibold`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Separator className="my-4" />
            <p className="mb-2 px-3 text-sm font-semibold text-navy">Categories</p>
            <ul className="space-y-3">
              {categories.map((group) => (
                <li key={group.href}>
                  <Link href={group.href} className="block rounded-md px-3 py-1 text-sm font-medium text-muted-foreground hover:text-navy">
                    {group.label}
                  </Link>
                  <ul>
                    {group.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className={linkClass}>
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
