import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";

import { collator } from "./collator";

let cache: CollectionEntry<"reviewedTitles">[];

export async function mostRecentReviewedTitles(limit: number) {
  if (cache) {
    return cache;
  }

  const reviewedTitles = await getCollection("reviewedTitles");

  reviewedTitles.sort((a, b) => {
    return collator.compare(b.data.reviewSequence, a.data.reviewSequence);
  });

  cache = reviewedTitles.slice(0, limit);

  return cache;
}
