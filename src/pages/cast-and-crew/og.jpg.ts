import type { APIRoute } from "astro";

import { createOpenGraphImageResponse } from "~/utils/createOpenGraphImageResponse";

export const GET: APIRoute = async function get() {
  return createOpenGraphImageResponse("Cast & Crew", "cast-and-crew");
};
