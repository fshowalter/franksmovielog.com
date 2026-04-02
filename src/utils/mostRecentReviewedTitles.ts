import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";

import { collator } from "./collator";

const MAX = 12;

let cache: CollectionEntry<"reviewedTitles">[];

export async function mostRecentReviewedTitles(
  limit: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
) {
  if (cache) {
    return cache.slice(0, limit);
  }

  const reviewedTitles = await getCollection("reviewedTitles");

  reviewedTitles.sort((a, b) => {
    return collator.compare(b.data.reviewSequence, a.data.reviewSequence);
  });

  cache = reviewedTitles.slice(0, MAX);

  return cache.slice(0, limit);
}
