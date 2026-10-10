import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "../icons";

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink("Hi, I have a question about precision measuring tools.", siteConfig.contact.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition hover:brightness-110"
    >
      <WhatsAppIcon width={28} height={28} />
      <span className="sr-only">Chat on WhatsApp (opens in a new tab)</span>
    </a>
  );
}
