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
        "w-full desktop:w-auto desktop:basis-[calc(50%_-_16px)]",
        className,
      )}
    >
      <h2 className="px-container py-7 font-sans text-xs font-medium uppercase tracking-wide text-muted desktop:px-8">
        {label}
      </h2>
      <div className="grid w-full grid-cols-[var(--container-padding),auto,1fr,auto,var(--container-padding)] tablet:whitespace-nowrap desktop:grid-cols-[2rem,auto,1fr,auto,2rem]">
        {values.map((value) => {
          return (
            <div
              className="relative col-span-5 grid grid-cols-subgrid grid-rows-[1fr,auto,auto,1fr] bg-default py-3 text-subtle has-[a:hover]:bg-accent has-[a:hover]:font-semibold has-[a:hover]:text-inverse"
              key={value.name}
            >
              <DetailsItemAvatar
                className="col-start-2 row-span-4 mr-6"
                imageProps={value.avatarImageProps}
                name={value.name}
              />
              <div className="col-span-2 col-start-3 row-start-2 grid grid-cols-subgrid">
                <Name value={value} valueType={valueType} />
                <div className="self-center text-nowrap pb-1 text-right font-sans text-xs">
                  {value.reviewCount} / {value.titleCount}
                </div>
              </div>
              <div className="col-span-2 col-start-3 row-start-3 bg-subtle">
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
      <a
        className="relative block pb-1 font-sans text-sm leading-none text-accent before:absolute before:left-[-72px] before:top-[-11px] before:aspect-square before:w-12 before:bg-default before:opacity-15 after:absolute after:bottom-[-6px] after:left-0 after:z-10 after:h-[6px] after:w-full hover:text-inverse hover:before:opacity-0"
        href={linkTarget}
      >
        {value.name}
      </a>
    );

  return (
    <span className="block pb-1 font-sans text-sm font-light leading-none text-subtle hover:text-inverse">
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
    <div
      className={ccn(
        "safari-border-radius-fix w-12 overflow-hidden rounded-full",
        className,
      )}
    >
      {avatar}
    </div>
  );
}
