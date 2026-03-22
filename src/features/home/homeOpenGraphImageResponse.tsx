import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

import { HomeOpenGraphImage } from "./HomeOpenGraphImage";

export async function homeOpenGraphImageResponse(): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop("home");

  return await componentToImageResponse(<HomeOpenGraphImage />, [
    {
      data: backdrop,
      src: "backdrop",
    },
  ]);
}
