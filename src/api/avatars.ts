import { getImage } from "astro:assets";

import { normalizeSources } from "./utils/normalizeSources";

export type AvatarImageProps = {
  src: string;
  srcSet: string;
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/avatars/*.png",
);

export async function getAvatarImageProps(
  slug: null | string,
  {
    height,
    width,
  }: {
    height: number;
    width: number;
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
    densities: [1, 2],
    format: "avif",
    height: height,
    quality: 80,
    src: avatarFile.default,
    width: width,
  });

  return {
    src: normalizeSources(optimizedImage.src),
    srcSet: normalizeSources(optimizedImage.srcSet.attribute),
  };
}
