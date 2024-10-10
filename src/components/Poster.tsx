import type { PosterImageProps } from "src/api/posters";

import { ccn } from "src/utils/concatClassNames";

type PosterProps = {
  className?: string;
  decoding: "async" | "auto" | "sync";
  height: number;
  imageProps: PosterImageProps | undefined;
  loading: "eager" | "lazy";
  width: number;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export function Poster({
  className,
  decoding = "async",
  imageProps,
  loading = "lazy",
  ...rest
}: PosterProps): JSX.Element {
  return (
    <img
      {...imageProps}
      alt=""
      {...rest}
      className={ccn("aspect-poster", className)}
      decoding={decoding}
      loading={loading}
    />
  );
}
