import type { JSX } from "react";

import type { PosterImageProps } from "~/api/posters";

type PosterProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
  decoding: "async" | "auto" | "sync";
  height: number;
  imageProps: PosterImageProps | undefined;
  loading: "eager" | "lazy";
  width: number;
};

export function Poster({
  className,
  decoding,
  imageProps,
  loading,
  ...rest
}: PosterProps): JSX.Element {
  return (
    <img
      {...imageProps}
      alt=""
      {...rest}
      className={`
        aspect-poster
        ${className ?? ""}
      `}
      decoding={decoding}
      loading={loading}
    />
  );
}
