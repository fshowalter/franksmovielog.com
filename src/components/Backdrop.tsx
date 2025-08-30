import type { BackdropImageProps } from "~/api/backdrops";

export const BackdropImageConfig = {
  height: 1350,
  sizes: "100vw",
  width: 2400,
};

export function Backdrop({
  breadcrumb,
  centerText = false,
  deck,
  imageProps,
  size = "default",
  title,
  titleStyle,
}: {
  breadcrumb?: React.ReactNode;
  centerText?: boolean;
  deck?: React.ReactNode;
  imageProps: BackdropImageProps;
  size?: "default" | "large";
  title: string;
  titleStyle?: string;
}): React.JSX.Element {
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
    <Wrapper centerText={centerText} heroImage={heroImage} size={size}>
      <Breadcrumb value={breadcrumb} />
      <Title className={titleStyle} value={title} />
      <Deck center={centerText} value={deck} />
    </Wrapper>
  );
}

export function BreadcrumbLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}): React.JSX.Element {
  return (
    <a
      className={`
        relative inline-block font-sans text-sm font-bold tracking-wide
        text-[#fff]/85 uppercase
        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full
        after:origin-center after:scale-x-0 after:bg-(--fg-inverse)/75
        after:transition-transform after:duration-500
        hover:after:scale-x-100
      `}
      href={href}
    >
      {children}
    </a>
  );
}

function Breadcrumb({
  value,
}: {
  value?: React.ReactNode;
}): false | React.JSX.Element {
  if (!value) {
    return false;
  }

  return <p className="mb-4">{value}</p>;
}

function Deck({
  center,
  value,
}: {
  center?: boolean;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <p
      className={`
        mt-1 font-sans text-base
        [text-shadow:1px_1px_2px_black]
        laptop:my-4 laptop:text-xl
        ${center ? `text-center` : ""}
      `}
    >
      {value}
    </p>
  );
}

function Title({
  className,
  value,
}: {
  center?: boolean;
  className?: string;
  value: string;
}): React.JSX.Element {
  return (
    <h1
      className={
        className ||
        `
          text-[2rem] leading-10 font-extrabold
          [text-shadow:1px_1px_2px_rgba(0,0,0,.25)]
          tablet:text-4xl
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
  centerText,
  children,
  heroImage,
  size = "default",
}: {
  centerText: boolean;
  children: React.ReactNode;
  heroImage?: React.ReactNode;
  size?: "default" | "large" | "small";
}): React.JSX.Element {
  const defaultSizes =
    "min-h-[400px] tablet:min-h-[640px] laptop:min-h-[clamp(640px,70vh,1350px)]";

  const largeSizes = "min-h-[90vh] max-h-[1350px]";

  const sizes = size === "large" ? largeSizes : defaultSizes;

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
          after:absolute after:top-0 after:left-0 after:-z-10 after:h-full
          after:w-full after:bg-(image:--hero-gradient)
        `}
      >
        {children}
      </div>
    </header>
  );
}
