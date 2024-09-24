import type { StillImageProps } from "src/api/stills";
import { ccn } from "src/utils/concatClassNames";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageProps: StillImageProps;
  sizes: string;
  width: number;
  height: number;
  loading: "lazy" | "eager";
  decoding: "async" | "auto" | "sync";
  className?: string;
}

export function Still({
  imageProps,
  loading = "lazy",
  decoding = "async",
  className,
  ...rest
}: Props): JSX.Element {
  return (
    <img
      {...imageProps}
      alt=""
      loading={loading}
      decoding={decoding}
      {...rest}
      className={ccn("aspect-video", className)}
    />
  );
}
