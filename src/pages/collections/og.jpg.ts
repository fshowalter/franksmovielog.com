import type { APIRoute } from "astro";

import { collectionsOpenGraphImageResponse } from "~/features/collections/collectionsOpenGraphImageResponse";

export const GET: APIRoute = async function get() {
  return collectionsOpenGraphImageResponse();
};
