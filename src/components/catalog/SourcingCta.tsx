import Link from "next/link";
import { siteConfig } from "@/config/site";
import { sourcingWhatsappMessage, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "../icons";
import { buttonClass } from "../shared";

/** The "Can't find it? We can import it" fallback block. */
export function SourcingCta({ query, compact = false }: { query?: string; compact?: boolean }) {
  const href = query ? `/source?part=${encodeURIComponent(query)}` : "/source";
  return (
    <div className={compact ? "space-y-3" : "space-y-3 border border-border bg-muted p-5"}>
      <h2 className="text-lg font-semibold text-navy">Didn’t find what you need?</h2>
      <p className="max-w-2xl text-sm text-muted-foreground">
        We source and import precision measuring tools and instruments. Send the part number, brand and quantity.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href={href} className={buttonClass("default")}>
          Request a custom import
        </Link>
        <a
          href={whatsappLink(sourcingWhatsappMessage(query), siteConfig.contact.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("whatsapp")}
        >
          <WhatsAppIcon width={18} height={18} />
          Ask on WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
