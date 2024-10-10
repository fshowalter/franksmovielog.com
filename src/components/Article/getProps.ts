import { getBackdropImageProps } from "~/api/backdrops";
import { getPage } from "~/api/pages";
import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { getStillImageProps } from "~/api/stills";
import { BackdropImageConfig } from "~/components/Backdrop";
import { MoreReviewsImageConfig } from "~/components/MoreReviews";

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
