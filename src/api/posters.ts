import { getImage } from "astro:assets";

import { normalizeSources } from "./utils/normalizeSources";

/**
 * Props for poster images.
 */
export type PosterImageProps = {
  src: string;
  srcSet: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/posters/*.png",
);

/**
 * Generates optimized poster image properties with fixed dimensions.
 * @param slug - The identifier for the poster image file
 * @param options - Image dimensions configuration
 * @param options.height - Fixed height for the poster image
 * @param options.width - Fixed width for the poster image
 * @returns Poster image properties with src and srcSet
 */
export async function getFixedWidthPosterImageProps(
  slug: string,
  {
    height,
    width,
  }: {
    height: number;
    width: number;
  },
): Promise<PosterImageProps> {
  const posterFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`/${slug}.png`);
  })!;

  const posterFile = await images[posterFilePath]();

  const optimizedImage = await getImage({
    densities: [1, 2],
    format: "avif",
    height: height,
    quality: 80,
    src: posterFile.default,
    width: width,
  });

  return {
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
  };
}

/**
 * Generates responsive poster image properties with multiple width variants.
 * @param slug - The identifier for the poster image file (defaults to "default")
 * @param options - Image dimensions configuration
 * @param options.height - Target height for the poster image
 * @param options.width - Base width for generating responsive variants
 * @returns Poster image properties with src and responsive srcSet
 */
export async function getFluidWidthPosterImageProps(
  slug: string | undefined = "default",
  {
    height,
    width,
  }: {
    height: number;
    width: number;
  },
): Promise<PosterImageProps> {
  const posterFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`/${slug}.png`);
  })!;

  if (!(posterFilePath in images)) {
    throw new Error(`Poster not found: ${slug}`);
  }

  const posterFile = await images[posterFilePath]();

  const optimizedImage = await getImage({
    format: "avif",
    height: height,
    quality: 80,
    src: posterFile.default,
    width: width,
    widths: [0.25, 0.5, 1, 2].map((w) => Math.ceil(w * width)),
  });

  return {
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
  };
}
