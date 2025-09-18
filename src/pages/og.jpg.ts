import type { APIRoute } from "astro";

import { getOpenGraphBackdropAsBase64String } from "~/api/backdrops";
import { OpenGraphImage } from "~/features/home/OpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

/**
 * API route handler for generating OpenGraph image.
 * @returns JPEG image response for OpenGraph preview
 */
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
