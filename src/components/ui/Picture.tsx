import Image, { type ImageProps } from "next/image";
import manifest from "@/content/image-manifest.json";

const sizes = manifest as Record<string, { w: number; h: number }>;

type Props = Omit<ImageProps, "width" | "height" | "src"> & { src: string; fill?: boolean };

/**
 * next/image with intrinsic dimensions looked up from the asset manifest, so
 * every image reserves its space (no layout shift) without hand-typed sizes.
 */
export function Picture({ src, fill, alt, ...rest }: Props) {
  if (fill) return <Image src={src} alt={alt} fill {...rest} />;
  const dim = sizes[src];
  if (!dim) throw new Error(`Image not in manifest: ${src} — run scripts/optimize-images.mjs`);
  return <Image src={src} alt={alt} width={dim.w} height={dim.h} {...rest} />;
}

export const imageRatio = (src: string) => {
  const dim = sizes[src];
  return dim ? `${dim.w} / ${dim.h}` : "4 / 3";
};
