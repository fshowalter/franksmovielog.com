import type { APIRoute } from "astro";
import { getOpenGraphBackdropAsBase64String } from "src/api/backdrops";
import { OpenGraphImage } from "src/components/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

export const GET: APIRoute = async function get() {
  const jpeg = await componentToImage(
    OpenGraphImage({
      title: "Viewings",
      backdrop: await getOpenGraphBackdropAsBase64String("viewings"),
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
