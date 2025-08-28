import type { JSX } from "react";

import type { PosterImageProps } from "~/api/posters";

type PosterProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  decoding: "async" | "auto" | "sync";
  height: number;
  imageProps: PosterImageProps | undefined;
  loading: "eager" | "lazy";
  width: number;
};

export function Poster({
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
      className="aspect-poster"
      decoding={decoding}
      loading={loading}
    />
  );
}
