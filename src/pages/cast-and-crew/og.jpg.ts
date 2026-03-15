import type { APIRoute } from "astro";

import { castAndCrewOpenGraphImageResponse } from "~/features/cast-and-crew/castAndCrewOpenGraphImageResponse";

export const GET: APIRoute = async function get() {
  return castAndCrewOpenGraphImageResponse();
};
