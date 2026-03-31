import type { APIRoute, InferGetStaticPropsType } from "astro";

import { getCollection } from "astro:content";

import { createOpenGraphImageResponse } from "~/utils/createOpenGraphImageResponse";

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function getStaticPaths() {
  const castAndCrew = await getCollection("castAndCrew");

  return castAndCrew.map(({ data: castAndCrewMember }) => {
    return {
      params: {
        slug: castAndCrewMember.slug,
      },
      props: {
        castAndCrewMember,
      },
    };
  });
}

/**
 * Astro API endpoint that generates personalized Open Graph images for individual authors.
 * Creates a JPEG image featuring the author's avatar, name, and custom backdrop for social
 * media sharing when author pages are shared on platforms like Facebook, Twitter, etc.
 *
 * @param context - Astro API context object
 * @param context.props - Author props containing name and slug from getStaticPaths
 * @returns HTTP response containing the generated JPEG image with appropriate content-type headers
 */
export const GET: APIRoute = async function get({ props }) {
  const { castAndCrewMember } = props as Props;

  return await createOpenGraphImageResponse(
    castAndCrewMember.name,
    castAndCrewMember.slug,
  );
};
