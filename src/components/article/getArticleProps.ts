import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { getStillImageProps } from "~/api/stills";
import { MoreReviewsImageConfig } from "~/components/more-reviews/MoreReviews";

import type { ArticleProps } from "./Article";

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
