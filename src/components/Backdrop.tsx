import type React from "react";
import type { BackdropImageProps } from "src/api/backdrops";

export const BackdropImageConfig = {
  width: 2400,
  height: 1350,
  sizes: "100vw",
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
  deck?: React.ReactNode | null;
  titleStyle?: string;
  breadcrumb?: React.ReactNode;
  size?: "default" | "large";
}) {
  const heroImage = (
    <img
      className="absolute inset-0 size-full object-cover object-top"
      {...imageProps}
      {...BackdropImageConfig}
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
    "min-h-[400px] tablet:min-h-[640px] desktop:min-h-[clamp(640px,70vh,1350px)]";

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
      className={`${sizes} relative flex w-full flex-col content-start items-center justify-end gap-6 bg-[#2A2B2A] pb-8 pt-40 text-inverse tablet:pb-10 tablet:pt-40 desktop:pb-16 desktop:pt-40`}
    >
      {heroImage}
      <div
        className={`${centerText ? "items-center" : ""} z-10 mx-auto flex w-full max-w-screen-max flex-col px-container`}
      >
        {children}
      </div>
    </header>
  );
}

function Title({
  value,
  className,
  center,
}: {
  value: string;
  className?: string;
  center?: boolean;
}) {
  return (
    <h1
      className={
        className
          ? className
          : `font-sans ${center ? "text-center" : ""} text-2xl font-bold uppercase tracking-widest desktop:text-7xl`
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

  return <p className="mb-2">{value}</p>;
}

export function BreadcrumbLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="font-sans text-sm uppercase tracking-wide decoration-inverse-subtle decoration-2 underline-offset-8 hover:underline"
    >
      {children}
    </a>
  );
}

function Deck({
  value,
  shadow,
  center,
}: {
  value?: React.ReactNode;
  shadow: boolean;
  center?: boolean;
}) {
  if (!value) {
    return null;
  }

  return (
    <p
      className={`mt-1 text-base desktop:my-4 desktop:text-xl ${shadow ? "[text-shadow:1px_1px_2px_black]" : ""} ${center ? "text-center" : ""}`}
    >
      {value}
    </p>
  );
}
