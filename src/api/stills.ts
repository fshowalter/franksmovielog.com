import { getImage } from "astro:assets";

import { normalizeSources } from "./utils/normalizeSources";

export interface StillImageProps {
  src: string;
  srcSet: string;
}

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/stills/*.png",
);

export async function getOpenGraphStillSrc(slug: string) {
  const stillFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`${slug}.png`);
  })!;

  const stillFile = await images[stillFilePath]();

  const image = await getImage({
    src: stillFile.default,
    width: 1200,
    height: 675,
    format: "jpeg",
    quality: 80,
  });

  return normalizeSources(image.src);
}

export async function getStillImageProps(
  slug: string,
  {
    width,
    height,
  }: {
    width: number;
    height: number;
  },
): Promise<StillImageProps> {
  const stillFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`${slug}.png`);
  })!;

  const stillFile = await images[stillFilePath]();

  const optimizedImage = await getImage({
    src: stillFile.default,
    width: width,
    height: height,
    format: "avif",
    widths: [0.25, 0.5, 1, 2].map((w) => w * width),
    quality: 80,
  });

  return {
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
    src: normalizeSources(optimizedImage.src),
  };
}
