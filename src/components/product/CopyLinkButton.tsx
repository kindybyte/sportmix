"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon } from "@/components/ui/Icons";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button onClick={copy} className="btn btn-outline btn-lg w-full">
      {copied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
      {copied ? "Ссылка скопирована" : "Скопировать ссылку на товар"}
    </button>
  );
}
