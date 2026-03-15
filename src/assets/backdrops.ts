import { getImage } from "astro:assets";
import path from "node:path";
import sharp from "sharp";

/**
 * Props for backdrop images.
 */
type BackdropImageProps = {
  src: string;
  srcSet: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/backdrops/*.png",
);

/**
 * Retrieves backdrop image properties for a given slug.
 * @param slug - Identifier for the backdrop image
 * @param options - Image dimensions
 * @param options.height - Desired image height
 * @param options.width - Desired image width
 * @returns Backdrop image properties with src and srcSet
 */
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
    src: optimizedImage.src,
    srcSet: optimizedImage.srcSet.attribute,
  };
}

export async function getOpenGraphBackdrop(slug: string) {
  const buffer = await sharp(
    path.resolve(`./content/assets/backdrops/${slug}.png`),
  )
    .resize(1200)
    .toBuffer();

  return new Uint8Array(buffer).buffer;
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
