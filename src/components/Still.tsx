import type { JSX } from "react";

import type { StillImageProps } from "~/api/stills";

import { ccn } from "~/utils/concatClassNames";

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
  decoding = "async",
  imageProps,
  loading = "lazy",
  ...rest
}: Props): JSX.Element {
  return (
    <img
      {...imageProps}
      alt=""
      decoding={decoding}
      loading={loading}
      {...rest}
      className={ccn("aspect-video", className)}
    />
  );
}
