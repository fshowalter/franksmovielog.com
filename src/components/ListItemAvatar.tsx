import type { AvatarImageProps } from "src/api/avatars";
import { Avatar } from "src/components/Avatar";
import { ccn } from "src/utils/concatClassNames";

export const ListItemAvatarImageConfig = {
  width: 80,
  height: 80,
};

export function ListItemAvatar({
  name,
  href,
  imageProps,
  className,
}: {
  name: string;
  href: string;
  imageProps: AvatarImageProps | null;
  className?: string;
}) {
  const avatar = (
    <Avatar
      name={name}
      imageProps={imageProps}
      width={ListItemAvatarImageConfig.width}
      height={ListItemAvatarImageConfig.height}
      loading="lazy"
      decoding="async"
      className="w-full"
    />
  );

  return (
    <a
      href={href}
      className={ccn(
        "safari-border-radius-fix w-full max-w-16 overflow-hidden rounded-[50%] shadow-all tablet:max-w-20",
        className,
      )}
    >
      {avatar}
    </a>
  );
}
