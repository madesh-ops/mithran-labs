import Image, { type ImageProps } from "next/image";
import manifest from "@/content/image-manifest.json";

const sizes = manifest as Record<string, { w: number; h: number }>;

type Props = Omit<ImageProps, "width" | "height" | "src"> & { src: string; fill?: boolean };

// next/image doesn't prefix basePath onto string sources, so on a sub-path
// deploy (GitHub Pages: /mithran-labs) local images would 404 without this.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const withBase = (src: string) => (base && src.startsWith("/") && !src.startsWith(base + "/") ? base + src : src);

/**
 * next/image with intrinsic dimensions looked up from the asset manifest, so
 * every image reserves its space (no layout shift) without hand-typed sizes.
 */
export function Picture({ src, fill, alt, ...rest }: Props) {
  if (fill) return <Image src={withBase(src)} alt={alt} fill {...rest} />;
  const dim = sizes[src];
  if (!dim) throw new Error(`Image not in manifest: ${src} — add its width and height to src/content/image-manifest.json`);
  return <Image src={withBase(src)} alt={alt} width={dim.w} height={dim.h} {...rest} />;
}

export const imageRatio = (src: string) => {
  const dim = sizes[src];
  return dim ? `${dim.w} / ${dim.h}` : "4 / 3";
};
