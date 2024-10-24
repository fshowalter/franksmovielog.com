import rss from "@astrojs/rss";

import type { Review } from "~/api/reviews";

import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { getOpenGraphStillSrc } from "~/api/stills";
import { textStarsForGrade } from "~/utils/textStarsForGrade";

function addMetaToExcerpt(excerpt: string, review: Review) {
  const meta = `${textStarsForGrade(
    review.grade,
  )} D: ${review.directorNames.join(
    ", ",
  )}. ${review.principalCastNames.join(", ")}.`;

  return `<p>${meta}</p>${excerpt}`;
}

export async function GET() {
  const reviews = await mostRecentReviews(10);

  const rssItems = await Promise.all(
    reviews.map(async (review) => {
      return await loadExcerptHtml(review);
    }),
  );

  return rss({
    customData:
      "<image><url>https://www.franksmovielog.com/assets/favicon-128.png</url><title>Frank's Movie Log</title><link>https://www.franksmovielog.com/</link></image>",
    // `<description>` field in output xml
    description: "Reviews of current, cult, classic, and forgotten films.",
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: await Promise.all(
      rssItems.map(async (item) => {
        const stillSrc = await getOpenGraphStillSrc(item.slug);

        return {
          content: `<img src="${stillSrc}" alt="">${addMetaToExcerpt(
            item.excerpt,
            item,
          )}`,
          link: `https://www.franksmovielog.com/reviews/${item.slug}/`,
          pubDate: item.date,
          title: `${item.title} (${item.year})`,
        };
      }),
    ),
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: "https://www.franksmovielog.com",
    // `<title>` field in output xml
    title: "Frank's Movie Log",
  });
}
