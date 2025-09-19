import type { PosterImageProps } from "~/api/posters";

type PosterProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
  decoding: "async" | "auto" | "sync";
  height: number;
  imageProps: PosterImageProps | undefined;
  loading: "eager" | "lazy";
  width: number;
};

/**
 * Renders a movie poster image.
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.decoding - Image decoding strategy
 * @param props.imageProps - Poster image source and srcset
 * @param props.loading - Loading strategy ("eager" or "lazy")
 * @returns Poster image element with aspect ratio
 */
export function Poster({
  className,
  decoding,
  imageProps,
  loading,
  ...rest
}: PosterProps): React.JSX.Element {
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
