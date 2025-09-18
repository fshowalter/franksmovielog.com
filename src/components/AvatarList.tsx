import type { AvatarImageProps } from "~/api/avatars";

import { Avatar } from "~/components/Avatar";

export const AvatarListItemImageConfig = {
  height: 80,
  width: 80,
};

export function AvatarList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <ol className={className} data-testid="avatar-list">
      {children}
    </ol>
  );
}

export function AvatarListItem({
  avatarImageProps,
  children,
  className = "",
}: {
  avatarImageProps: AvatarImageProps | undefined;
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <li
      className={`
        group/list-item relative mb-1 flex max-w-(--breakpoint-desktop) flex-row
        gap-x-4 bg-default px-container py-4 transition-all
        tablet:gap-x-6 tablet:px-4
        tablet-landscape:has-[a:hover]:z-5
        tablet-landscape:has-[a:hover]:scale-[102.5%]
        tablet-landscape:has-[a:hover]:transform-gpu
        tablet-landscape:has-[a:hover]:shadow-all
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
        tablet-landscape:has-[a:hover]:duration-500
        laptop:px-6
        ${className}
      `}
    >
      <div
        className={`
          relative rounded-full
          after:absolute after:top-0 after:left-0 after:size-full
          after:bg-default after:opacity-20 after:transition-opacity
          after:duration-500
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

function ListItemAvatar({
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
      height={AvatarListItemImageConfig.height}
      imageProps={imageProps}
      loading="lazy"
      width={AvatarListItemImageConfig.width}
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
