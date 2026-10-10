"use client";

import Image from "next/image";
import { useState } from "react";
import { GearIcon } from "../icons";
import { cn } from "../shared";

/** Shows the first product image, or a neutral placeholder until photos are supplied. */
export function ProductImage({
  src,
  alt,
  brand,
  className,
  frame = "card",
  sizes = "(max-width: 640px) 46vw, (max-width: 1100px) 30vw, 240px",
  preload = false,
}: {
  src?: string;
  alt: string;
  brand?: string;
  className?: string;
  /** `card` is a wide frame for grids. `square` is the product page photo. */
  frame?: "card" | "square";
  sizes?: string;
  preload?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const photo = src && !failed ? src : undefined;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        frame === "square" ? "aspect-square" : "aspect-[5/4]",
        photo ? "bg-white" : "grid place-items-center bg-muted",
        className,
      )}
    >
      {photo?.startsWith("http") ? (
        // Remote file, loaded directly so the photo stays the exact source image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={alt}
          onError={() => setFailed(true)}
          className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] object-contain sm:inset-3 sm:h-[calc(100%-1.5rem)] sm:w-[calc(100%-1.5rem)]"
        />
      ) : photo ? (
        <div className="absolute inset-2 sm:inset-3">
          <Image
            src={photo}
            alt={alt}
            fill
            sizes={sizes}
            quality={90}
            preload={preload}
            className="object-contain"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground" role="img" aria-label={`${alt} (image coming soon)`}>
          <GearIcon width={44} height={44} strokeWidth={1.2} />
          {brand && <span className="text-xs text-muted-foreground">{brand}</span>}
        </div>
      )}
    </div>
  );
}
