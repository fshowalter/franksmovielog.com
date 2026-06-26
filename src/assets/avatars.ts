import { getImage } from "astro:assets";

export type AvatarImageProps = {
  height: number;
  src: string;
  srcSet: string;
  width: number;
};

const AvatarImageConfig = {
  height: 80,
  width: 80,
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/avatars/*.png",
);

export async function getAvatarImageProps(
  slug: string | undefined,
): Promise<AvatarImageProps | undefined> {
  const avatarFilePath = Object.keys(images).find((path) => {
    return path.endsWith(`${slug}.png`);
  });

  if (!avatarFilePath) {
    return;
  }

  const avatarFile = await images[avatarFilePath]();

  const optimizedImage = await getImage({
    densities: [1, 2],
    format: "avif",
    height: AvatarImageConfig.height,
    quality: 80,
    src: avatarFile.default,
    width: AvatarImageConfig.width,
  });

  return {
    ...AvatarImageConfig,
    src: optimizedImage.src,
    srcSet: optimizedImage.srcSet.attribute,
  };
}
