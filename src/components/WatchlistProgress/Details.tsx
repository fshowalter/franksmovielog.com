import type { AvatarImageProps } from "~/api/avatars";

import { Avatar } from "~/components/Avatar";
import { BarGradient } from "~/components/BarGradient";
import { ccn } from "~/utils/concatClassNames";

type Value = {
  avatarImageProps: AvatarImageProps | undefined;
  name: string;
  reviewCount: number;
  slug: string | undefined;
  titleCount: number;
};

type ValueType = "collection" | "director" | "performer" | "writer";

export function Details({
  className,
  label,
  values,
  valueType,
}: {
  className?: string;
  label: string;
  values: Value[];
  valueType: ValueType;
}) {
  return (
    <section
      className={ccn(
        `
          w-full
          desktop:w-auto desktop:basis-[calc(50%-16px)]
        `,
        className,
      )}
    >
      <h2
        className={`
          px-container py-8 font-sans text-xs font-medium tracking-wide
          text-muted uppercase
          desktop:px-8
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
          desktop:grid-cols-[2rem_auto_24px_1fr_2rem]
        `}
      >
        {values.map((value) => {
          return (
            <div
              className={`
                group/list-item relative col-span-5 grid transform-gpu
                grid-cols-subgrid grid-rows-[1fr_auto_auto_1fr] bg-default py-4
                text-subtle transition-transform
                last-of-type:shadow-none
                has-[a:hover]:z-30 has-[a:hover]:scale-105
                has-[a:hover]:shadow-all has-[a:hover]:drop-shadow-2xl
              `}
              key={value.name}
            >
              <div
                className={`
                  relative col-start-2 row-span-4 transition-opacity
                  after:absolute after:top-0 after:left-0 after:z-60
                  after:size-full after:overflow-hidden after:rounded-full
                  after:bg-default after:opacity-15
                  group-has-[a:hover]/list-item:after:opacity-0
                `}
              >
                <DetailsItemAvatar
                  className=""
                  imageProps={value.avatarImageProps}
                  name={value.name}
                />
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

function Name({ value, valueType }: { value: Value; valueType: ValueType }) {
  const linkTarget =
    valueType === "collection"
      ? `/collections/${value.slug}/`
      : `/cast-and-crew/${value.slug}/`;

  if (value.slug)
    return (
      <span>
        <a
          className={`
            pb-1 font-sans text-sm leading-none text-accent
            after:absolute after:top-0 after:left-0 after:z-30 after:size-full
            after:opacity-0
          `}
          href={linkTarget}
        >
          {value.name}
        </a>
      </span>
    );

  return (
    <span
      className={`
        block pb-1 font-sans text-sm leading-none font-light text-subtle
      `}
    >
      {value.name}
    </span>
  );
}

export const DetailsAvatarImageConfig = {
  height: 48,
  width: 48,
};

function DetailsItemAvatar({
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
      height={DetailsAvatarImageConfig.height}
      imageProps={imageProps}
      loading="lazy"
      name={name}
      width={DetailsAvatarImageConfig.width}
    />
  );

  return (
    <div className={ccn("w-12 overflow-hidden rounded-full", className)}>
      {avatar}
    </div>
  );
}
