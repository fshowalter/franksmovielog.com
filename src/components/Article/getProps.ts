import { getBackdropImageProps } from "src/api/backdrops";
import { getPage } from "src/api/pages";
import { loadExcerptHtml, mostRecentReviews } from "src/api/reviews";
import { getStillImageProps } from "src/api/stills";
import { BackdropImageConfig } from "src/components/Backdrop";
import { MoreReviewsImageConfig } from "src/components/MoreReviews";

import type { Props } from "./Article";

export async function getProps({
  deck,
  slug,
}: {
  deck: string;
  slug: string;
}): Promise<Props> {
  const { content, title } = await getPage(slug);
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
