import type { APIRoute } from "astro";
import type { InferGetStaticPropsType } from "astro";

import { getCollection } from "astro:content";

import { openGraphImageResponse } from "~/utils/openGraphImageResponse";

/**
 * Props type inferred from getStaticPaths function, containing the year
 * for generating yearly reading statistics Open Graph images.
 */
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

/**
 * Astro static path generation function that creates routes for yearly reading statistics OG images.
 * Generates a static path for each year that has reading statistics data, enabling pre-built
 * Open Graph images for individual yearly stats pages at build time.
 *
 * @returns Array of path objects with params (year) and props (year) for each statistics year
 */
export async function getStaticPaths() {
  const yearStats = await getCollection("yearStats");

  return yearStats.map(({ data: stats }) => {
    return {
      params: {
        year: stats.year,
      },
      props: {
        year: stats.year,
      },
    };
  });
}

export const GET: APIRoute = async function get({ props }) {
  const { year } = props as Props;

  return await openGraphImageResponse(`${year} Stats`, year);
};
