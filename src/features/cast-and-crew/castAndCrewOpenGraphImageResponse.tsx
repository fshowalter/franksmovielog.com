import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

export async function castAndCrewOpenGraphImageResponse(): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop("cast-and-crew");

  return await componentToImageResponse(
    <OpenGraphImage title={`Cast & Crew`} />,
    [
      {
        data: backdrop,
        src: "backdrop",
      },
    ],
  );
}
