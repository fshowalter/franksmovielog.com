import type { BackdropImageProps } from "src/api/backdrops";

export const BackdropImageConfig = {
  width: 2400,
  height: 1350,
};

export function Backdrop({
  imageProps,
  title,
  deck,
  alt,
  titleStyle = "font-sans-bold text-2xl uppercase desktop:text-7xl",
}: {
  imageProps: BackdropImageProps;
  alt: string;
  title: string;
  deck?: string;
  titleStyle?: string;
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
        alt={alt}
      />
      <div className="z-10 mx-auto w-full max-w-screen-max px-container">
        <h1 className={titleStyle}>{title}</h1>
        {deck && (
          <p className="mt-1 text-base desktop:my-4 desktop:text-lg">{deck}</p>
        )}
      </div>
    </header>
  );
}
