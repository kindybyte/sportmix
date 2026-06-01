import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  name = "SportMix",
}: {
  className?: string;
  href?: string | null;
  name?: string;
}) {
  const content = (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-ink text-paper">
        <span className="font-display text-lg font-extrabold leading-none">S</span>
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-signal ring-2 ring-paper" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight">
          {name}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
          Оптовый каталог
        </span>
      </span>
    </span>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}
