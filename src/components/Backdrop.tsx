import type { AvatarImageProps } from "src/api/avatars";
import type { BackdropImageProps } from "src/api/backdrops";

import { Avatar } from "./Avatar";

export const BackdropImageConfig = {
  width: 2400,
  height: 1350,
};

export function Backdrop({
  imageProps,
  title,
  deck,
  breadcrumb,
  titleStyle,
  size = "default",
}: {
  imageProps: BackdropImageProps;
  title: string;
  deck?: string;
  titleStyle?: string;
  breadcrumb?: React.ReactNode;
  size?: "default" | "large";
}) {
  const heroImage = (
    <img
      className="absolute inset-0 size-full object-cover object-top"
      {...imageProps}
      width={BackdropImageConfig.width}
      height={BackdropImageConfig.height}
      loading="eager"
      fetchPriority="high"
      alt=""
    />
  );

  return (
    <Wrapper heroImage={heroImage} size={size}>
      <Breadcrumb value={breadcrumb} />
      <Title value={title} className={titleStyle} />
      <Deck value={deck} shadow={true} />
    </Wrapper>
  );
}

export function SolidBackdrop({
  title,
  deck,
  breadcrumb,
}: {
  title: string;
  deck: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <Wrapper size="small">
      <Breadcrumb value={breadcrumb} />
      <Title value={title} />
      <Deck value={deck} shadow={false} />
    </Wrapper>
  );
}

export function AvatarBackdrop({
  avatarImageProps,
  name,
  deck,
  breadcrumb,
}: {
  avatarImageProps: AvatarImageProps | null;
  name: string;
  deck: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <Wrapper centerText={true} size="small">
      <div className="safari-border-radius-fix mx-auto mb-6 w-4/5 max-w-[250px] overflow-hidden rounded-[50%]">
        <Avatar
          imageProps={avatarImageProps}
          name={name}
          width={250}
          height={250}
          loading="lazy"
          decoding="async"
          data-pagefind-meta="image[src], image_alt[alt]"
        />
      </div>
      <Breadcrumb value={breadcrumb} />
      <Title value={name} />
      <Deck value={deck} shadow={false} />
    </Wrapper>
  );
}

function Wrapper({
  children,
  centerText = false,
  size = "default",
  heroImage,
}: {
  children: React.ReactNode;
  centerText?: boolean;
  size?: "default" | "large" | "small";
  heroImage?: React.ReactNode;
}) {
  const defaultSizes =
    "min-h-[400px] tablet:min-h-[640px] desktop:min-h-[clamp(640px,60vh,1350px)]";

  const largeSizes = "min-h-[90vh] max-h-[1350px]";

  const smallSizes = "min-h-[240px] desktop:min-h-[clamp(640px,50vh,1350px)]";

  const sizes =
    size === "large"
      ? largeSizes
      : size === "small"
        ? smallSizes
        : defaultSizes;

  return (
    <header
      className={`${sizes} relative flex min-h-[240px] flex-col content-start items-center justify-end gap-6 bg-[#2A2B2A] pb-8 pt-40 text-inverse tablet:pb-10 tablet:pt-40 desktop:pb-16 desktop:pt-40`}
    >
      {heroImage}
      <div
        className={`${centerText ? "text-center" : ""} z-10 mx-auto w-full max-w-screen-max px-container`}
      >
        {children}
      </div>
    </header>
  );
}

function Title({ value, className }: { value: string; className?: string }) {
  return (
    <h1
      className={
        className
          ? className
          : `font-sans text-2xl font-bold uppercase tracking-[2px] desktop:text-7xl`
      }
    >
      {value}
    </h1>
  );
}

function Breadcrumb({ value }: { value?: React.ReactNode }) {
  if (!value) {
    return null;
  }

  return (
    <p className="mb-2 font-sans-narrow text-sm uppercase tracking-[0.8px] underline decoration-subtle decoration-2 underline-offset-4">
      {value}
    </p>
  );
}

function Deck({ value, shadow }: { value?: React.ReactNode; shadow: boolean }) {
  if (!value) {
    return null;
  }

  return (
    <p
      className={`mt-1 text-base desktop:my-4 desktop:text-xl ${shadow ? "[text-shadow:1px_1px_2px_black]" : ""}`}
    >
      {value}
    </p>
  );
}
