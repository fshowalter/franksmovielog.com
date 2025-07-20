import type React from "react";

import type { BackdropImageProps } from "~/api/backdrops";

export const BackdropImageConfig = {
  height: 1350,
  sizes: "100vw",
  width: 2400,
};

export function Backdrop({
  bottomShadow = false,
  breadcrumb,
  centerText = false,
  deck,
  imageProps,
  size = "default",
  title,
  titleStyle,
}: {
  bottomShadow?: boolean;
  breadcrumb?: React.ReactNode;
  centerText?: boolean;
  deck?: React.ReactNode;
  imageProps: BackdropImageProps;
  size?: "default" | "large";
  title: string;
  titleStyle?: string;
}) {
  const heroImage = (
    <img
      className="absolute inset-0 size-full object-cover object-top"
      {...imageProps}
      {...BackdropImageConfig}
      alt=""
      fetchPriority="high"
      loading="eager"
    />
  );

  return (
    <Wrapper
      bottomShadow={bottomShadow}
      centerText={centerText}
      heroImage={heroImage}
      size={size}
    >
      <Breadcrumb value={breadcrumb} />
      <Title className={titleStyle} value={title} />
      <Deck center={centerText} shadow={true} value={deck} />
    </Wrapper>
  );
}

export function BreadcrumbLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      className={`
        font-sans text-sm tracking-wide uppercase decoration-inverse-subtle
        decoration-2 underline-offset-8
        hover:underline
      `}
      href={href}
    >
      {children}
    </a>
  );
}

function Breadcrumb({ value }: { value?: React.ReactNode }) {
  if (!value) {
    return false;
  }

  return <p className="mb-2">{value}</p>;
}

function Deck({
  center,
  shadow,
  value,
}: {
  center?: boolean;
  shadow: boolean;
  value?: React.ReactNode;
}) {
  if (!value) {
    return false;
  }

  return (
    <p
      className={`
        mt-1 text-base
        laptop:my-4 laptop:text-xl
        ${shadow ? `[text-shadow:1px_1px_2px_black]` : ""}
        ${center ? `text-center` : ""}
      `}
    >
      {value}
    </p>
  );
}

function Title({
  center,
  className,
  value,
}: {
  center?: boolean;
  className?: string;
  value: string;
}) {
  return (
    <h1
      className={
        className ||
        `
          font-sans
          ${center ? "text-center" : ""}
          text-2xl font-bold tracking-widest uppercase
          laptop:text-7xl
        `
      }
      data-pagefind-weight="10"
    >
      {value}
    </h1>
  );
}

function Wrapper({
  bottomShadow = false,
  centerText = false,
  children,
  heroImage,
  size = "default",
}: {
  bottomShadow?: boolean;
  centerText?: boolean;
  children: React.ReactNode;
  heroImage?: React.ReactNode;
  size?: "default" | "large" | "small";
}) {
  const defaultSizes =
    "min-h-[400px] tablet:min-h-[640px] laptop:min-h-[clamp(640px,70vh,1350px)]";

  const largeSizes = "min-h-[90vh] max-h-[1350px]";

  const smallSizes = "min-h-[240px] laptop:min-h-[clamp(640px,50vh,1350px)]";

  const sizes =
    size === "large"
      ? largeSizes
      : size === "small"
        ? smallSizes
        : defaultSizes;

  return (
    <header
      className={`
        ${sizes}
        relative flex w-full flex-col content-start items-center justify-end
        gap-6 bg-[#2A2B2A] pt-40 pb-8 text-inverse
        tablet:pt-40 tablet:pb-10
        laptop:pt-40 laptop:pb-16
      `}
    >
      {heroImage}
      <div
        className={`
          ${centerText ? "items-center" : ""}
          z-10 mx-auto flex w-full max-w-(--breakpoint-desktop) flex-col
          px-container
          ${
            bottomShadow
              ? `
                after:absolute after:top-0 after:left-0 after:-z-10 after:h-full
                after:w-full after:bg-linear-to-t after:from-[rgba(0,0,0,.85)]
                after:to-50%
                tablet:after:to-25%
              `
              : ""
          }
        `}
      >
        {children}
      </div>
    </header>
  );
}
