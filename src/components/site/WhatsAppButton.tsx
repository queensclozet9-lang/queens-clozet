import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Queens Clozet on WhatsApp"

      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-forest text-ivory shadow-soft transition-transform duration-300 hover:-translate-y-0.5 hover:bg-forest-deep"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
