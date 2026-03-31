import type { AvatarImageProps } from "~/assets/avatars";

import { Avatar } from "~/components/avatar/Avatar";

export function AvatarListItemAvatar({
  imageProps,
}: {
  imageProps: AvatarImageProps | undefined;
}): React.JSX.Element {
  const avatar = (
    <Avatar
      className={`
        w-full transform-gpu transition-transform duration-500
        group-has-[a:hover]/list-item:scale-110
      `}
      imageProps={imageProps}
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
