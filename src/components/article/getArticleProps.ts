import { getBackdropImageProps } from "~/api/backdrops";
import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { getStillImageProps } from "~/api/stills";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";
import { MoreReviewsImageConfig } from "~/components/more-reviews/MoreReviews";

import type { ArticleProps } from "./Article";

export async function getProps({
  content,
  deck,
  slug,
  title,
}: {
  content?: string;
  deck: string;
  slug: string;
  title: string;
}): Promise<ArticleProps> {
  const recentReviews = await mostRecentReviews(4);

  return {
    backdropImageProps: await getBackdropImageProps(slug, BackdropImageConfig),
    content,
    deck,
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
    title,
  };
}
