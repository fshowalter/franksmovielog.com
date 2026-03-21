import { getImage } from "astro:assets";

import { normalizeSources } from "./utils/normalizeSources";

/**
 * Props for still images.
 */
type StillImageProps = {
  src: string;
  srcSet: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/stills/*.png",
);

/**
 * Generates OpenGraph still image source URL.
 * @param slug - Identifier for the still image
 * @returns Optimized JPEG image source URL
 */
export async function getOpenGraphStillSrc(slug: string) {
  const stillFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`/${slug}.png`);
  })!;

  const stillFile = await images[stillFilePath]();

  const image = await getImage({
    format: "jpeg",
    height: 675,
    quality: 80,
    src: stillFile.default,
    width: 1200,
  });

  return normalizeSources(image.src);
}

export async function getUpdateStillProps(
  slug: string,
): Promise<StillImageProps> {
  const stillFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`/${slug}.png`);
  })!;

  const stillFile = await images[stillFilePath]();

  const optimizedImage = await getImage({
    format: "png",
    height: 1080,
    quality: 100,
    src: stillFile.default,
    width: 1920,
  });

  return {
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
  };
}
