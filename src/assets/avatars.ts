import { getImage } from "astro:assets";

/**
 * Props for avatar images.
 */
export type AvatarImageProps = {
  src: string;
  srcSet: string;
};

const AvatarImageConfig = {
  height: 80,
  width: 80,
};

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/content/assets/avatars/*.png",
);

/**
 * Generates optimized avatar image properties for a given slug.
 * @param slug - The identifier for the avatar image file
 * @param options - Image dimensions configuration
 * @param options.height - Target height for the avatar image
 * @param options.width - Target width for the avatar image
 * @returns Avatar image properties with src and srcSet, or undefined if not found
 */
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
    src: optimizedImage.src,
    srcSet: optimizedImage.srcSet.attribute,
  };
}
