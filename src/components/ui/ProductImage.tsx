import Image from "next/image";
import { SpoolIcon } from "./Icons";
import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-line/60 to-panel text-muted/50",
          className
        )}
      >
        <SpoolIcon className="h-10 w-10" />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width:768px) 100vw, 33vw"}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
