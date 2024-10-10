import type { AvatarImageProps } from "~/api/avatars";

import { Avatar } from "~/components/Avatar";
import { BarGradient } from "~/components/BarGradient";
import { ccn } from "~/utils/concatClassNames";

type ValueType = "collection" | "director" | "performer" | "writer";

type Value = {
  avatarImageProps: AvatarImageProps | null;
  name: string;
  reviewCount: number;
  slug: null | string;
  titleCount: number;
};

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
        "w-full bg-default px-container pb-8 desktop:w-auto desktop:basis-[calc(50%_-_16px)] desktop:px-8",
        className,
      )}
    >
      <h2 className="py-4 font-sans text-xs font-medium uppercase tracking-wide text-muted shadow-bottom">
        {label}
      </h2>
      <div className="grid w-full grid-cols-[auto,1fr,auto] tablet:whitespace-nowrap">
        {values.map((value) => {
          return (
            <div
              className="relative col-span-3 grid grid-cols-subgrid grid-rows-[1fr,auto,auto,1fr] py-3"
              key={value.name}
            >
              <DetailsItemAvatar
                className="row-span-4 mr-6"
                imageProps={value.avatarImageProps}
                name={value.name}
              />
              <div className="col-span-2 col-start-2 row-start-2 grid grid-cols-subgrid">
                <Name value={value} valueType={valueType} />
                <div className="col-start-3 self-center text-nowrap pb-1 text-right font-sans text-xs text-subtle">
                  {value.reviewCount} / {value.titleCount}
                </div>
              </div>
              <div className="col-span-2 col-start-2 row-start-3 bg-subtle">
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
  let linkTarget;

  if (valueType === "collection") {
    linkTarget = `/collections/${value.slug}/`;
  } else {
    linkTarget = `/cast-and-crew/${value.slug}/`;
  }

  if (value.slug)
    return (
      <a
        className="block pb-1 font-sans text-sm font-normal leading-none text-accent before:absolute before:left-0 before:top-3 before:aspect-square before:w-12 hover:underline"
        href={linkTarget}
      >
        {value.name}
      </a>
    );

  return (
    <span className="block pb-1 font-sans text-sm font-light leading-none text-subtle">
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
  imageProps: AvatarImageProps | null;
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
