import { getImage } from "astro:assets";

import { normalizeSources } from "./utils/normalizeSources";

export type PosterImageProps = {
  src: string;
  srcSet: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/posters/*.png",
);

export async function getFixedWidthPosterImageProps(
  slug: null | string,
  {
    height,
    width,
  }: {
    height: number;
    width: number;
  },
): Promise<PosterImageProps> {
  if (!slug) {
    slug = "default";
  }

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

  const posterFile = await images[posterFilePath]();

  const optimizedImage = await getImage({
    format: "avif",
    height: height,
    quality: 80,
    src: posterFile.default,
    width: width,
    widths: [0.25, 0.5, 1, 2].map((w) => w * width),
  });

  return {
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
  };
}
