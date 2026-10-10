import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Cropped official PNG: 882 × 238. */
export function Logo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center" aria-label={`${siteConfig.name} – home`}>
      <span className={inverted ? "bg-white px-2 py-1" : undefined}>
        <Image
          src="/logo.png"
          alt={siteConfig.name}
          width={882}
          height={238}
          priority
          className={cn("h-11 w-auto sm:h-14", className)}
        />
      </span>
    </Link>
  );
}
