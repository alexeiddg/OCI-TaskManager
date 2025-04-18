"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function FloatingTelegramButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        href="https://t.me/oci_pms_testenv_bot"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center justify-center rounded-full",
          "h-10 w-10 p-1 bg-[#0088cc] hover:bg-[#007bb5]",
          "shadow-lg transition-colors duration-200",
          "text-white",
        )}
      >
        <TelegramIcon className="w-8 h-8" />
        <span className="sr-only">Open Telegram</span>
      </Link>
    </div>
  );
}

function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="currentColor"
    >
      <circle fill="#0088cc" cx="120" cy="120" r="120" />
      <path
        fill="#FFF"
        d="M97.5 164.6c-2.3 0-1.9-0.9-2.7-3.2L84 126.6l74.2-44.3"
      />
      <path
        fill="#FFF"
        d="M97.5 164.6c1.8 0 2.6-0.8 3.6-1.8l10-9.7 20.7 15.2c3.8 2.1 6.6 1 7.5-3.5l13.5-63.8c1.4-5.6-2.1-8.2-5.7-6.6L67.8 122c-5.5 2.2-5.4 5.3-1 6.7l18.4 5.7 42.7-26.8c2-1.2 3.9-0.6 2.4 0.8"
      />
    </svg>
  );
}
