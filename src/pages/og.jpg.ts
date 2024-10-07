import type { APIRoute } from "astro";
import { getOpenGraphBackdropAsBase64String } from "src/api/backdrops";
import { OpenGraphImage } from "src/components/Home/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

export const GET: APIRoute = async function get() {
  const jpeg = await componentToImage(
    OpenGraphImage({
      backdrop: await getOpenGraphBackdropAsBase64String("home"),
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
