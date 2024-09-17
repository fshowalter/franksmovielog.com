import type { AvatarImageProps } from "src/api/avatars";
import { Avatar } from "src/components/Avatar";

export const ListItemAvatarImageConfig = {
  width: 80,
  height: 80,
};

export function ListItemAvatar({
  name,
  href,
  imageProps,
}: {
  name: string;
  href: string;
  imageProps: AvatarImageProps | null;
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
      className="safari-border-radius-fix w-full max-w-16 overflow-hidden rounded-[50%] shadow-all tablet:max-w-20"
    >
      {avatar}
    </a>
  );
}
