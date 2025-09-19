import type { AvatarImageProps } from "~/api/avatars";

import { Avatar } from "~/components/avatar/Avatar";

/**
 * Renders an avatar image for use in avatar list items.
 * @param props - Component props
 * @param props.imageConfig - Height and width configuration for the image
 * @param props.imageProps - Avatar image properties including src and srcset
 * @returns Avatar component wrapped in a styled container
 */
export function AvatarListItemAvatar({
  imageConfig,
  imageProps,
}: {
  imageConfig: {
    height: number;
    width: number;
  };
  imageProps: AvatarImageProps | undefined;
}): React.JSX.Element {
  const avatar = (
    <Avatar
      className={`
        w-full transform-gpu transition-transform duration-500
        group-has-[a:hover]/list-item:scale-110
      `}
      height={imageConfig.height}
      imageProps={imageProps}
      loading="lazy"
      width={imageConfig.width}
    />
  );

  return (
    <div
      className={`
        w-16 safari-border-radius-fix overflow-hidden rounded-full
        drop-shadow-md
        tablet:w-20
      `}
    >
      {avatar}
    </div>
  );
}
