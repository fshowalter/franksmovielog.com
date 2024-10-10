import type { StillImageProps } from "~/api/stills";

import { ccn } from "~/utils/concatClassNames";

type Props = {
  className?: string;
  decoding: "async" | "auto" | "sync";
  height: number;
  imageProps: StillImageProps;
  loading: "eager" | "lazy";
  sizes: string;
  width: number;
} & React.ImgHTMLAttributes<HTMLImageElement>;

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
