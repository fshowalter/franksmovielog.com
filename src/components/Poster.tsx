import type { PosterImageProps } from "src/api/posters";
import { ccn } from "src/utils/concatClassNames";

interface PosterProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageProps: PosterImageProps | undefined;
  width: number;
  height: number;
  loading: "lazy" | "eager";
  decoding: "async" | "auto" | "sync";
  className?: string;
}

export function Poster({
  imageProps,
  loading = "lazy",
  decoding = "async",
  className,
  ...rest
}: PosterProps): JSX.Element {
  return (
    <img
      {...imageProps}
      alt=""
      {...rest}
      className={ccn("aspect-poster", className)}
      loading={loading}
      decoding={decoding}
    />
  );
}
