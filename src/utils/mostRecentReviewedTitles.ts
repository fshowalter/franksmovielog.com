import { getCollection } from "astro:content";

import { collator } from "./collator";

export async function mostRecentReviewedTitles(limit: number) {
  const reviewedTitles = await getCollection("reviewedTitles");

  reviewedTitles.sort((a, b) => {
    return collator.compare(b.data.reviewSequence, a.data.reviewSequence);
  });

  return reviewedTitles.slice(0, limit);
}
