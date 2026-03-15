import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

export async function watchlistOpenGraphImageResponse(): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop("watchlist");

  return await componentToImageResponse(
    <OpenGraphImage title={`Watchlist`} />,
    [
      {
        data: backdrop,
        src: "backdrop",
      },
    ],
  );
}
