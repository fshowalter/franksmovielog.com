import type { APIRoute } from "astro";

import { createOpenGraphImageResponse } from "~/utils/createOpenGraphImageResponse";

export const GET: APIRoute = async function get() {
  return createOpenGraphImageResponse({
    backdropSlug: "cast-and-crew",
    title: "Cast & Crew",
  });
};
