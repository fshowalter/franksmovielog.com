import type { AvatarImageProps } from "~/api/avatars";

import { Avatar } from "~/components/avatar/Avatar";
import { BarGradient } from "~/components/bar-gradient/BarGradient";

type Value = {
  avatarImageProps: AvatarImageProps | undefined;
  name: string;
  reviewCount: number;
  slug: string | undefined;
  titleCount: number;
};

type ValueType = "collection" | "director" | "performer" | "writer";

export function WatchlistProgressForGroup({
  className,
  label,
  values,
  valueType,
}: {
  className?: string;
  label: string;
  values: Value[];
  valueType: ValueType;
}): React.JSX.Element {
  return (
    <section
      className={`
        w-full
        laptop:w-auto laptop:basis-[calc(50%-16px)]
        ${className ?? ""}
      `}
    >
      <h2
        className={`
          px-container py-8 font-sans text-xs font-bold tracking-wide text-muted
          uppercase
          laptop:px-8
        `}
      >
        {label}
      </h2>
      <div
        className={`
          grid w-full
          grid-cols-[var(--container-padding)_auto_24px_1fr_var(--container-padding)]
          gap-y-1
          tablet:whitespace-nowrap
          laptop:grid-cols-[2rem_auto_24px_1fr_2rem]
        `}
      >
        {values.map((value) => {
          return (
            <div
              className={`
                group/list-item relative col-span-5 grid transform-gpu
                grid-cols-subgrid grid-rows-[1fr_auto_auto_1fr] bg-default py-4
                text-subtle transition-all duration-500
                last-of-type:shadow-none
                tablet-landscape:has-[a:hover]:z-hover
                tablet-landscape:has-[a:hover]:scale-[102.5%]
                tablet-landscape:has-[a:hover]:shadow-all
                tablet-landscape:has-[a:hover]:drop-shadow-2xl
              `}
              key={value.name}
            >
              <div
                className={`
                  relative col-start-2 row-span-4 transition-all
                  after:absolute after:top-0 after:left-0
                  after:z-watchlist-overlay after:size-full
                  after:overflow-hidden after:rounded-full after:bg-default
                  after:opacity-20 after:duration-500
                  group-has-[a:hover]/list-item:after:opacity-0
                `}
              >
                <ValueAvatar className="" imageProps={value.avatarImageProps} />
              </div>
              <div
                className={`
                  col-start-4 row-start-2 flex items-center justify-between
                `}
              >
                <Name value={value} valueType={valueType} />
                <div
                  className={`
                    self-center pb-1 text-right font-sans text-xs leading-0
                    text-nowrap
                  `}
                >
                  {value.reviewCount} / {value.titleCount}
                </div>
              </div>
              <div className="col-start-4 row-start-3 bg-subtle">
                <BarGradient
                  maxValue={value.titleCount}
                  value={value.reviewCount}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Name({
  value,
  valueType,
}: {
  value: Value;
  valueType: ValueType;
}): React.JSX.Element {
  const linkTarget =
    valueType === "collection"
      ? `/collections/${value.slug}/`
      : `/cast-and-crew/${value.slug}/`;

  if (value.slug)
    return (
      <span>
        <a
          className={`
            pb-1 text-base leading-none font-normal text-default transition-all
            duration-500
            after:absolute after:top-0 after:left-0 after:z-hover
            after:size-full after:opacity-0
            hover:text-accent
          `}
          href={linkTarget}
        >
          {value.name}
        </a>
      </span>
    );

  return (
    <span className={`block pb-1 font-sans text-sm leading-none text-subtle`}>
      {value.name}
    </span>
  );
}

export const WatchlistProgressForGroupAvatarImageConfig = {
  height: 48,
  width: 48,
};

function ValueAvatar({
  className,
  imageProps,
}: {
  className?: string;
  imageProps: AvatarImageProps | undefined;
}): React.JSX.Element {
  const avatar = (
    <Avatar
      className={`
        w-full transform-gpu transition-transform duration-500
        group-has-[a:hover]/list-item:scale-110
      `}
      height={WatchlistProgressForGroupAvatarImageConfig.height}
      imageProps={imageProps}
      loading="lazy"
      width={WatchlistProgressForGroupAvatarImageConfig.width}
    />
  );

  return (
    <div
      className={`
        w-12 overflow-hidden rounded-full
        ${className ?? ""}
      `}
    >
      {avatar}
    </div>
  );
}
