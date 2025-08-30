import type { StillImageProps } from "~/api/stills";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
  decoding: "async" | "auto" | "sync";
  height: number;
  imageProps: StillImageProps;
  loading: "eager" | "lazy";
  sizes: string;
  width: number;
};

export function Still({
  className,
  decoding,
  imageProps,
  loading,
  ...rest
}: Props): React.JSX.Element {
  return (
    <img
      {...imageProps}
      alt=""
      decoding={decoding}
      loading={loading}
      {...rest}
      className={`
        aspect-video
        ${className ?? ""}
      `}
    />
  );
}
