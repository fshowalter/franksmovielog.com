import type { JSX } from "react";

import type { StillImageProps } from "~/api/stills";

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "className"> & {
  className?: string;
  decoding: "async" | "auto" | "sync";
  height: number;
  imageProps: StillImageProps;
  loading: "eager" | "lazy";
  sizes: string;
  width: number;
};

export function Still({
  className = "aspect-video",
  decoding,
  imageProps,
  loading,
  ...rest
}: Props): JSX.Element {
  return (
    <img
      {...imageProps}
      alt=""
      className={className}
      decoding={decoding}
      loading={loading}
      {...rest}
    />
  );
}
