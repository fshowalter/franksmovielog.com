import rss from "@astrojs/rss";
import { getEntry } from "astro:content";

import { getFeedStillProps } from "~/assets/stills";
import { mostRecentReviewedTitles } from "~/utils/mostRecentReviewedTitles";

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
  "F+": "&#9733;",
  "F-": "&#189;",
};

export async function feed() {
  const reviewedTitles = await mostRecentReviewedTitles(10);

  return rss({
    customData:
      "<image><url>https://www.franksmovielog.com/assets/favicon-128.png</url><title>Frank's Movie Log</title><link>https://www.franksmovielog.com/</link></image>",
    // `<description>` field in output xml
    description: "Reviews of current, cult, classic, and forgotten films.",
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: await Promise.all(
      reviewedTitles.map(async ({ data: title }) => {
        const { data: review } = await getEntry(title.review);
        const { src } = await getFeedStillProps(review.slug);
        let excerptHtml = review.excerptHtml.replace(/\n+$/, "");
        excerptHtml = excerptHtml.replace(
          /<\/p>$/,
          ` <a href="/reviews/${review.slug}/">Read more...</a></p>`,
        );

        return {
          content: `<img src="${src}" alt=""><p>${textStarsForGrade(
            review.grade,
          )}</p>${excerptHtml}`,
          link: `https://www.franksmovielog.com/reviews/${review.slug}/`,
          pubDate: review.date,
          title: `${title.title} (${title.releaseYear})`,
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

function textStarsForGrade(grade: string) {
  return gradeMap[grade];
}
