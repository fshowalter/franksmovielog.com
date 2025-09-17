import { getBackdropImageProps } from "~/api/backdrops";

import { BackdropImageConfig } from "./Backdrop";

export async function getLayoutBackdropImageProps(slug: string) {
  return getBackdropImageProps(slug, BackdropImageConfig);
}
