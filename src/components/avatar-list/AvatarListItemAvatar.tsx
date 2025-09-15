import type { AvatarImageProps } from "~/api/avatars";

import { Avatar } from "~/components/Avatar";

export function AvatarListItemAvatar({
  imageProps,
  imageConfig,
}: {
  imageProps: AvatarImageProps | undefined;
  imageConfig: {
    height: number;
    width: number;
  };
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
