import type { PosterImageProps } from "src/api/posters";
import { ccn } from "src/utils/concatClassNames";

interface PosterProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  title: string;
  year: string | number;
  imageProps: PosterImageProps | undefined;
  width: number;
  height: number;
  loading: "lazy" | "eager";
  decoding: "async" | "auto" | "sync";
  className?: string;
}

export function Poster({
  title,
  year,
  imageProps,
  loading = "lazy",
  decoding = "async",
  className,
  ...rest
}: PosterProps): JSX.Element {
  return (
    <img
      {...imageProps}
      alt={`A poster from ${title} (${year})`}
      {...rest}
      className={ccn("aspect-[0.66666667]", className)}
      loading={loading}
      decoding={decoding}
    />
  );
}
