import rss from "@astrojs/rss";

import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { getOpenGraphStillSrc } from "~/api/stills";

const gradeMap: Record<string, string> = {
  A: "&#9733;&#9733;&#9733;&#9733;&#9733;",
  "A+": "&#9733;&#9733;&#9733;&#9733;&#9733;",
  "A-": "&#9733;&#9733;&#9733;&#9733;&#189;",
  B: "&#9733;&#9733;&#9733;&#9733;",
  "B+": "&#9733;&#9733;&#9733;&#9733;",
  "B-": "&#9733;&#9733;&#9733;&#189;",
  C: "&#9733;&#9733;&#9733;",
  "C+": "&#9733;&#9733;&#9733;",
  "C-": "&#9733;&#9733;&#189;",
  D: "&#9733;&#9733;",
  "D+": "&#9733;&#9733;",
  "D-": "&#9733;&#189;",
  F: "&#9733;",
};

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
        let excerptHtml = item.excerpt.replace(/\n+$/, "");
        excerptHtml = excerptHtml.replace(
          /<\/p>$/,
          ` <a href="/reviews/${item.slug}/">Read more...</a></p>`,
        );

        return {
          content: `<img src="${stillSrc}" alt=""><p>${textStarsForGrade(
            item.grade,
          )}</p>${excerptHtml}`,
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

export function textStarsForGrade(grade: string) {
  return gradeMap[grade];
}
