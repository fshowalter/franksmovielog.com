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

export type BackdropImageProps = {
  src: string;
  srcSet: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/backdrops/*.png",
);

const cacheConfig = createCacheConfig("backdrop-base64");

export async function getBackdropImageProps(
  slug: string,
  {
    height,
    width,
  }: {
    height: number;
    width: number;
  },
): Promise<BackdropImageProps> {
  const backdropFile = await getBackdropFile(slug);

  const optimizedImage = await getImage({
    format: "avif",
    height: height,
    quality: 80,
    src: backdropFile.default,
    width: width,
    widths: [0.3, 0.5, 0.8, 1].map((w) => w * width),
  });

  return {
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
  };
}

export async function getOpenGraphBackdropAsBase64String(slug: string) {
  const width = 1200;
  const format = "png";
  let cacheKey = "";

  if (cacheConfig.enableCache) {
    await ensureCacheDir(cacheConfig.cacheDir);

    const cacheKeyData = `${slug}-${width}-${format}`;
    cacheKey = createCacheKey(cacheKeyData);

    const cachedBackdrop = await getCachedItem<string>(
      cacheConfig.cacheDir,
      cacheKey,
      "txt",
      false,
      cacheConfig.debugCache,
      `Backdrop base64: ${slug}`,
    );

    if (cachedBackdrop) {
      return cachedBackdrop;
    }
  }

  const imageBuffer = await sharp(
    path.resolve(`./content/assets/backdrops/${slug}.png`),
  )
    .resize(width)
    .toFormat(format)
    .toBuffer();

  const base64String = `data:${"image/png"};base64,${imageBuffer.toString("base64")}`;

  if (cacheConfig.enableCache) {
    await saveCachedItem(cacheConfig.cacheDir, cacheKey, "txt", base64String);
  }

  return base64String;
}

async function getBackdropFile(slug: string) {
  const backdropFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`${slug}.png`);
  });

  if (!backdropFilePath) {
    throw new Error(`Backdrop not found: ${slug}`);
  }

  return await images[backdropFilePath]();
}
