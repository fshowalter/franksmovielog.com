import type { APIRoute } from "astro";

import { getOpenGraphBackdropAsBase64String } from "~/api/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

export const GET: APIRoute = async function get() {
  const jpeg = await componentToImage(
    OpenGraphImage({
      backdrop: await getOpenGraphBackdropAsBase64String("stats"),
      title: "All-Time Stats",
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
