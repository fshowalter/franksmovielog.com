import type { APIRoute, InferGetStaticPropsType } from "astro";

import { getCollection } from "astro:content";

import { reviewOpenGraphImageResponse } from "~/features/review/reviewOpenGraphImageResponse";

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function getStaticPaths() {
  const reviewedTitles = await getCollection("reviewedTitles");

  return reviewedTitles.map(({ data: reviewedTitle }) => {
    return {
      params: {
        slug: reviewedTitle.review.id,
      },
      props: {
        reviewedTitle,
      },
    };
  });
}

export const GET: APIRoute = async function get({ props }) {
  const { reviewedTitle } = props as Props;

  return await reviewOpenGraphImageResponse({
    grade: reviewedTitle.grade,
    releaseYear: reviewedTitle.releaseYear,
    stillSlug: reviewedTitle.review.id,
    title: reviewedTitle.title,
  });
};
