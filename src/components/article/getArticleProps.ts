import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { getStillImageProps } from "~/api/stills";
import { MoreReviewsImageConfig } from "~/components/more-reviews/MoreReviews";

import type { ArticleProps } from "./Article";

/**
 * Fetches props for the Article component including recent reviews with stills.
 * @param options - Configuration object
 * @param options.content - Optional markdown content for the article
 * @returns Props for the Article component
 */
export async function getProps({
  content,
}: {
  content?: string;
}): Promise<ArticleProps> {
  const recentReviews = await mostRecentReviews(4);

  return {
    content,
    recentReviews: await Promise.all(
      recentReviews.map(async (review) => {
        const titleWithExcerpt = await loadExcerptHtml(review);
        return {
          ...titleWithExcerpt,
          stillImageProps: await getStillImageProps(
            titleWithExcerpt.slug,
            MoreReviewsImageConfig,
          ),
        };
      }),
    ),
  };
}
