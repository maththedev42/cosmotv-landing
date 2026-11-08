import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Shot } from "@/lib/screenshots";

/**
 * A store screenshot shown whole: intrinsic ratio, auto height, never cropped.
 * These frames are product evidence — the caption next to them describes what
 * is visible in this exact image.
 */
export function ShotImage({
  shot,
  alt,
  sizes,
  preload = false,
  className,
}: {
  shot: Shot;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={shot.src}
      width={shot.width}
      height={shot.height}
      alt={alt}
      sizes={sizes}
      preload={preload}
      loading={preload ? "eager" : "lazy"}
      className={cn(
        "block h-auto w-full ring-1 ring-white/10",
        shot.device === "iphone" ? "rounded-[1.6rem]" : "rounded-[1.4rem]",
        className,
      )}
    />
  );
}
