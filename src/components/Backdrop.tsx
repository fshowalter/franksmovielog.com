import type { BackdropImageProps } from "src/api/backdrops";

export const BackdropImageConfig = {
  width: 2400,
  height: 1350,
};

export function Backdrop({
  imageProps,
  title,
  deck,
  breadcrumb,
  titleStyle = "font-sans font-bold tracking-[2px] text-2xl uppercase desktop:text-7xl",
}: {
  imageProps: BackdropImageProps;
  title: string;
  deck?: string;
  titleStyle?: string;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <header className="relative flex min-h-[240px] content-start items-end bg-cover pb-8 pt-40 text-inverse [background-position-x:center] tablet:min-h-[400px] tablet:pb-10 tablet:pt-40 desktop:min-h-[clamp(640px,50vh,1350px)] desktop:pb-16 desktop:pt-40">
      <img
        className="absolute inset-0 size-full object-cover object-top"
        {...imageProps}
        width={BackdropImageConfig.width}
        height={BackdropImageConfig.height}
        loading="eager"
        fetchPriority="high"
        alt=""
      />
      <div className="z-10 mx-auto w-full max-w-screen-max px-container">
        {breadcrumb && (
          <p className="mb-2 font-sans-narrow text-sm font-medium uppercase tracking-[0.8px] underline decoration-subtle decoration-2 underline-offset-4">
            {breadcrumb}
          </p>
        )}
        <h1 className={titleStyle}>{title}</h1>
        {deck && (
          <p className="mt-1 text-base [text-shadow:1px_1px_2px_black] desktop:my-4 desktop:text-xl">
            {deck}
          </p>
        )}
      </div>
    </header>
  );
}
