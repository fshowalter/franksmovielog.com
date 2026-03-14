import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

export async function watchlistProgressOpenGraphImageResponse(): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop("watchlist-progress");

  return await componentToImageResponse(
    <OpenGraphImage title={`Watchlist Progress`} />,
    [
      {
        data: backdrop,
        src: "backdrop",
      },
    ],
  );
}
