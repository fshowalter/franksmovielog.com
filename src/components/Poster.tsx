import type { PosterImageProps } from "src/api/posters";
import { twMerge } from "tailwind-merge";

interface PosterProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  title: string;
  year: string | number;
  imageProps: PosterImageProps | undefined;
  sizes: string;
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
      className={twMerge("aspect-[0.66666667]", className)}
      loading={loading}
      decoding={decoding}
    />
  );
}
