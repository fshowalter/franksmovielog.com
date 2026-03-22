import type { CollectionEntry } from "astro:content";

export function reviewPageTitle(
  reviewedTitle: CollectionEntry<"reviewedTitles">["data"],
) {
  let pageTitle = `${reviewedTitle.title} movie review`;

  pageTitle =
    pageTitle.length <= 10
      ? `${pageTitle} & summary (${reviewedTitle.releaseYear})`
      : `${pageTitle} (${reviewedTitle.releaseYear})`;

  return pageTitle;
}
