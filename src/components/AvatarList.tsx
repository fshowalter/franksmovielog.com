import type { JSX } from "react";

import type { AvatarImageProps } from "~/api/avatars";

import { Avatar } from "~/components/Avatar";
import { ccn } from "~/utils/concatClassNames";

export const ListItemAvatarImageConfig = {
  height: 80,
  width: 80,
};

export function AvatarListItem({
  avatarImageProps,
  children,
  className = "",
}: {
  avatarImageProps: AvatarImageProps | undefined;
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <li
      className={`
        group/list-item relative mb-1 flex max-w-(--breakpoint-desktop)
        transform-gpu flex-row gap-x-4 bg-default px-container py-4
        transition-transform
        tablet:gap-x-6 tablet:px-4
        tablet-landscape:has-[a:hover]:z-5
        tablet-landscape:has-[a:hover]:scale-[102.5%]
        tablet-landscape:has-[a:hover]:shadow-all
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
        laptop:px-6
        ${className}
      `}
    >
      <div
        className={`
          relative rounded-full
          after:absolute after:top-0 after:left-0 after:size-full
          after:bg-default after:opacity-15 after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
          ${className}
        `}
      >
        <ListItemAvatar imageProps={avatarImageProps} />
      </div>
      {children}
    </li>
  );
}

export function ListItemAvatar({
  className,
  imageProps,
}: {
  className?: string;
  imageProps: AvatarImageProps | undefined;
}) {
  const avatar = (
    <Avatar
      className="w-full"
      height={ListItemAvatarImageConfig.height}
      imageProps={imageProps}
      loading="lazy"
      width={ListItemAvatarImageConfig.width}
    />
  );

  return (
    <div
      className={ccn(
        `
          w-16 safari-border-radius-fix overflow-hidden rounded-full
          drop-shadow-md
          tablet:w-20
        `,
        className,
      )}
    >
      {avatar}
    </div>
  );
}
