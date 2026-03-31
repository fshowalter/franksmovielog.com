import { getImage } from "astro:assets";

const PosterImageConfig = {
  format: "avif",
  height: 372,
  quality: 80,
  width: 248,
};

/**
 * Props for poster images.
 */
export type PosterImageProps = {
  height: number;
  src: string;
  srcSet: string;
  width: number;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/posters/*.png",
);

export async function getFixedWidthPosterImageProps(
  slug: string,
): Promise<PosterImageProps> {
  const posterFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`/${slug}.png`);
  })!;

  const posterFile = await images[posterFilePath]();

  const optimizedImage = await getImage({
    ...PosterImageConfig,
    densities: [1, 2],
    src: posterFile.default,
  });

  return {
    height: PosterImageConfig.height,
    src: optimizedImage.src,
    srcSet: optimizedImage.srcSet.attribute,
    width: PosterImageConfig.width,
  };
}

export async function getFluidWidthPosterImageProps(
  slug: string | undefined = "default",
): Promise<PosterImageProps> {
  const posterFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`/${slug}.png`);
  })!;

  if (!(posterFilePath in images)) {
    throw new Error(`Poster not found: ${slug}`);
  }

  const posterFile = await images[posterFilePath]();

  const optimizedImage = await getImage({
    src: posterFile.default,
    widths: [0.25, 0.5, 1, 2].map((w) =>
      Math.ceil(w * PosterImageConfig.width),
    ),
    ...PosterImageConfig,
  });

  return {
    height: PosterImageConfig.height,
    src: optimizedImage.src,
    srcSet: optimizedImage.srcSet.attribute,
    width: PosterImageConfig.width,
  };
}
