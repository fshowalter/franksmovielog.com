import { getImage } from "astro:assets";

import { normalizeSources } from "./utils/normalizeSources";

export interface AvatarImageProps {
  src: string;
  srcSet: string;
}

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/avatars/*.png",
);

export async function getAvatarImageProps(
  slug: string | null,
  {
    width,
    height,
  }: {
    width: number;
    height: number;
  },
): Promise<AvatarImageProps | null> {
  const avatarFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`${slug}.png`);
  });

  if (!avatarFilePath) {
    return null;
  }

  const avatarFile = await images[avatarFilePath]();

  const optimizedImage = await getImage({
    src: avatarFile.default,
    width: width,
    height: height,
    format: "avif",
    densities: [1, 2],
    quality: 80,
  });

  return {
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
    src: normalizeSources(optimizedImage.src),
  };
}
