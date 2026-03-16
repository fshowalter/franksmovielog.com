import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

export async function collectionsOpenGraphImageResponse(): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop("collections");

  return await componentToImageResponse(
    <OpenGraphImage title={`Collections`} />,
    [
      {
        data: backdrop,
        src: "backdrop",
      },
    ],
  );
}
