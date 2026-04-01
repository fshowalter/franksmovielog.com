import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImageResponse } from "~/utils/componentToImage";

export async function createOpenGraphImageResponse(
  title: string,
  backdropSlug: string,
): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop(backdropSlug);

  return await componentToImageResponse(<OpenGraphImage title={title} />, [
    {
      data: backdrop,
      src: "backdrop",
    },
  ]);
}
