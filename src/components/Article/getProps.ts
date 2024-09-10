import { getBackdropImageProps } from "src/api/backdrops";
import { getPage } from "src/api/pages";
import { loadExcerptHtml, mostRecentReviews } from "src/api/reviews";
import { getStillImageProps } from "src/api/stills";
import { StillListItemImageConfig } from "src/components/StillListItem";

import type { Props } from "./Article";
import { BackdropImageConfig } from "./Article";

export async function getProps({
  slug,
  alt,
}: {
  slug: string;
  alt: string;
}): Promise<Props> {
  const { title, content } = await getPage(slug);
  const recentReviews = await mostRecentReviews(4);

  return {
    title,
    content,
    alt,
    backdropImageProps: await getBackdropImageProps(slug, BackdropImageConfig),
    recentReviews: await Promise.all(
      recentReviews.map(async (review) => {
        const titleWithExcerpt = await loadExcerptHtml(review);
        return {
          ...titleWithExcerpt,
          stillImageProps: await getStillImageProps(
            titleWithExcerpt.slug,
            StillListItemImageConfig,
          ),
        };
      }),
    ),
  };
}
