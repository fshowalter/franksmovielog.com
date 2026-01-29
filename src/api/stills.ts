import { getImage } from "astro:assets";
import path from "node:path";
import sharp from "sharp";

import {
  createCacheConfig,
  createCacheKey,
  ensureCacheDir,
  getCachedItem,
  saveCachedItem,
} from "~/utils/cache";

import { normalizeSources } from "./utils/normalizeSources";

const cacheConfig = createCacheConfig("still-og");

/**
 * Props for still images.
 */
export type StillImageProps = {
  src: string;
  srcSet: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/stills/*.png",
);

/**
 * Generates OpenGraph still image.
 * @param slug - Identifier for the backdrop image
 * @returns Base64-encoded PNG image string
 */
export async function getOpenGraphStillBuffer(slug: string) {
  const width = 1200;
  const format = "png";
  let cacheKey = "";

  if (cacheConfig.enableCache) {
    await ensureCacheDir(cacheConfig.cacheDir);

    const cacheKeyData = `${slug}-${width}-${format}`;
    cacheKey = createCacheKey(cacheKeyData);

    const cachedBackdrop = await getCachedItem<Buffer<ArrayBufferLike>>(
      cacheConfig.cacheDir,
      cacheKey,
      "png",
      true,
      cacheConfig.debugCache,
      `Cached open-graph still: ${slug}`,
    );

    if (cachedBackdrop) {
      return cachedBackdrop;
    }
  }

  const imageBuffer = await sharp(
    path.resolve(`./content/assets/stills/${slug}.png`),
  )
    .resize(width)
    .toFormat(format)
    .toBuffer();

  if (cacheConfig.enableCache) {
    await saveCachedItem(cacheConfig.cacheDir, cacheKey, "png", imageBuffer);
  }

  return imageBuffer;
}

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

/**
 * Retrieves still image properties for a given slug.
 * @param slug - Identifier for the still image
 * @param options - Image dimensions
 * @param options.height - Desired image height
 * @param options.width - Desired image width
 * @returns Still image properties with src and srcSet
 */
export async function getStillImageProps(
  slug: string,
  {
    height,
    width,
  }: {
    height: number;
    width: number;
  },
): Promise<StillImageProps> {
  const stillFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`/${slug}.png`);
  })!;

  const stillFile = await images[stillFilePath]();

  const optimizedImage = await getImage({
    format: "avif",
    height: height,
    quality: 80,
    src: stillFile.default,
    width: width,
    widths: [0.25, 0.5, 1, 2].map((w) => w * width),
  });

  return {
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
  };
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
