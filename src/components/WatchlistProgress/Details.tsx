import type { AvatarImageProps } from "src/api/avatars";
import { Avatar } from "src/components/Avatar";
import { BarGradient } from "src/components/BarGradient";
import { ccn } from "src/utils/concatClassNames";

type ValueType = "director" | "writer" | "performer" | "collection";

interface Value {
  name: string;
  reviewCount: number;
  titleCount: number;
  slug: string | null;
  avatarImageProps: AvatarImageProps | null;
}

export function Details({
  label,
  valueType,
  values,
  className,
}: {
  label: string;
  valueType: ValueType;
  values: Value[];
  className?: string;
}) {
  return (
    <section
      className={ccn(
        "w-full bg-default px-container pb-8 desktop:w-auto desktop:basis-[calc(50%_-_16px)] desktop:px-8",
        className,
      )}
    >
      <h2 className="py-4 font-sans-narrow text-xs font-semibold uppercase tracking-[1px] text-muted shadow-bottom">
        {label}
      </h2>
      <div className="grid w-full grid-cols-[auto,1fr,auto] tablet:whitespace-nowrap">
        {values.map((value) => {
          return (
            <div
              key={value.name}
              className="relative col-span-3 grid grid-cols-subgrid grid-rows-[1fr,auto,auto,1fr] py-3"
            >
              <DetailsItemAvatar
                imageProps={value.avatarImageProps}
                name={value.name}
                className="row-span-4 mr-6"
              />
              <div className="col-span-2 col-start-2 row-start-2 grid grid-cols-subgrid">
                <Name value={value} valueType={valueType} />
                <div className="col-start-3 self-center text-nowrap pb-1 text-right font-sans-narrow text-xs text-subtle tablet:text-sm">
                  {value.reviewCount} / {value.titleCount}
                </div>
              </div>
              <div className="col-span-2 col-start-2 row-start-3 bg-subtle">
                <BarGradient
                  value={value.reviewCount}
                  maxValue={value.titleCount}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Name({ value, valueType }: { valueType: ValueType; value: Value }) {
  let linkTarget;

  if (valueType === "collection") {
    linkTarget = `/collections/${value.slug}/`;
  } else {
    linkTarget = `/cast-and-crew/${value.slug}/`;
  }

  if (value.slug)
    return (
      <a
        className="block pb-1 font-sans-narrow text-sm font-medium leading-none tracking-[-0.3px] text-accent before:absolute before:left-0 before:top-3 before:aspect-square before:w-12 hover:underline tablet:text-base"
        href={linkTarget}
      >
        {value.name}
      </a>
    );

  return (
    <span className="block pb-1 font-sans-narrow text-sm font-medium leading-none tracking-[-0.3px] text-subtle">
      {value.name}
    </span>
  );
}

export const DetailsAvatarImageConfig = {
  width: 48,
  height: 48,
};

export function DetailsItemAvatar({
  name,
  imageProps,
  className,
}: {
  name: string;
  imageProps: AvatarImageProps | null;
  className?: string;
}) {
  const avatar = (
    <Avatar
      name={name}
      imageProps={imageProps}
      width={DetailsAvatarImageConfig.width}
      height={DetailsAvatarImageConfig.height}
      loading="lazy"
      className="w-full"
    />
  );

  return (
    <div
      className={ccn(
        "safari-border-radius-fix w-12 overflow-hidden rounded-[50%]",
        className,
      )}
    >
      {avatar}
    </div>
  );
}
