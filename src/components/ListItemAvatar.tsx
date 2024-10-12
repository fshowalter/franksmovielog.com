import type { AvatarImageProps } from "~/api/avatars";

import { Avatar } from "~/components/Avatar";
import { ccn } from "~/utils/concatClassNames";

export const ListItemAvatarImageConfig = {
  height: 80,
  width: 80,
};

export function ListItemAvatar({
  className,
  imageProps,
  name,
}: {
  className?: string;
  imageProps: AvatarImageProps | undefined;
  name: string;
}) {
  const avatar = (
    <Avatar
      className="w-full"
      height={ListItemAvatarImageConfig.height}
      imageProps={imageProps}
      loading="lazy"
      name={name}
      width={ListItemAvatarImageConfig.width}
    />
  );

  return (
    <div
      className={ccn(
        "safari-border-radius-fix w-16 overflow-hidden rounded-full shadow-all tablet:w-20",
        className,
      )}
    >
      {avatar}
    </div>
  );
}
