import { getImage } from "astro:assets";

/**
 * Props for backdrop images.
 */
type PortraitImageProps = {
  src: string;
  srcSet: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/portraits/*.png",
);

export async function getPortraitImageProps(
  slug: string,
  {
    height,
    width,
  }: {
    height: number;
    width: number;
  },
): Promise<PortraitImageProps> {
  const portraitFile = await getPortraitFile(slug);

  const optimizedImage = await getImage({
    format: "avif",
    height: height,
    quality: 80,
    src: portraitFile.default,
    width: width,
    widths: [0.3, 0.5, 0.8, 1].map((w) => w * width),
  });

  return {
    src: optimizedImage.src,
    srcSet: optimizedImage.srcSet.attribute,
  };
}

async function getPortraitFile(slug: string) {
  const portraitFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`${slug}.png`);
  });

  if (!portraitFilePath) {
    throw new Error(`Portrait not found: ${slug}`);
  }

  return await images[portraitFilePath]();
}
