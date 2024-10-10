import type { PosterImageProps } from "src/api/posters";

import { ccn } from "src/utils/concatClassNames";

interface PosterProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  decoding: "async" | "auto" | "sync";
  height: number;
  imageProps: PosterImageProps | undefined;
  loading: "eager" | "lazy";
  width: number;
}

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
