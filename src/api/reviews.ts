import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";

import { ENABLE_CACHE } from "~/utils/cache";
import { collator } from "~/utils/collator";
import { perfLogger } from "~/utils/performanceLogger";

import type { ReviewedTitleJson } from "./data/reviewed-titles-json";
import type { MarkdownReview } from "./data/reviews-markdown";

import { allReviewedTitlesJson } from "./data/reviewed-titles-json";
import { allReviewsMarkdown } from "./data/reviews-markdown";
import { createReleaseSequenceMap } from "./utils/createReleaseSequenceMap";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";
import { trimToExcerpt } from "./utils/markdown/trimToExcerpt";

let cachedMarkdownReviews: MarkdownReview[];
let cachedReviewedTitlesJson: ReviewedTitleJson[];
const cachedExcerptHtml: Map<string, string> = new Map();

/**
 * Review combining markdown content with title metadata.
 */
type Review = Omit<MarkdownReview, "date"> & ReviewedTitleJson;

type ReviewExcerpt = {
  excerpt: string;
};

type Reviews = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  reviews: (Review & { releaseSequence: number })[];
};

/**
 * Loads and converts review excerpt or synopsis to HTML format.
 * @param review - Review object with slug identifier
 * @returns Review with HTML-formatted excerpt
 */
export async function loadExcerptHtml<T extends { slug: string }>(
  review: T,
): Promise<ReviewExcerpt & T> {
  return await perfLogger.measure("loadExcerptHtml", async () => {
    // Check cache first
    if (ENABLE_CACHE && cachedExcerptHtml.has(review.slug)) {
      return {
        ...review,
        excerpt: cachedExcerptHtml.get(review.slug)!,
      };
    }

    const reviewsMarkdown =
      cachedMarkdownReviews || (await allReviewsMarkdown());
    if (ENABLE_CACHE && !cachedMarkdownReviews) {
      cachedMarkdownReviews = reviewsMarkdown;
    }

    const { rawContent, synopsis } = reviewsMarkdown.find((markdown) => {
      return markdown.slug === review.slug;
    })!;

    const excerptContent = synopsis || rawContent;

    const excerptHtml = getMastProcessor()
      .use(removeFootnotes)
      .use(trimToExcerpt)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .processSync(excerptContent)
      .toString();

    // Cache the result
    if (ENABLE_CACHE) {
      cachedExcerptHtml.set(review.slug, excerptHtml);
    }

    return {
      ...review,
      excerpt: excerptHtml,
    };
  });
}

/**
 * Retrieves the most recent reviews up to the specified limit.
 * @param limit - Maximum number of recent reviews to return
 * @returns Array of most recent reviews sorted by review sequence
 */
export async function mostRecentReviews(limit: number) {
  return await perfLogger.measure("mostRecentReviews", async () => {
    const reviewedTitlesJson =
      cachedReviewedTitlesJson || (await allReviewedTitlesJson());
    if (ENABLE_CACHE && !cachedReviewedTitlesJson) {
      cachedReviewedTitlesJson = reviewedTitlesJson;
    }

    reviewedTitlesJson.sort((a, b) => b.reviewSequence - a.reviewSequence);
    const slicedTitles = reviewedTitlesJson.slice(0, limit);

    const { reviews } = await parseReviewedTitlesJson(slicedTitles);

    return reviews;
  });
}

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}

async function parseReviewedTitlesJson(
  reviewedTitlesJson: ReviewedTitleJson[],
): Promise<Reviews> {
  const distinctReviewYears = new Set<string>();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();
  const reviewsMarkdown = cachedMarkdownReviews || (await allReviewsMarkdown());
  if (ENABLE_CACHE && !cachedMarkdownReviews) {
    cachedMarkdownReviews = reviewsMarkdown;
  }

  const releaseSequenceMap = createReleaseSequenceMap(reviewedTitlesJson);

  const reviews = reviewedTitlesJson.map((title) => {
    for (const genre of title.genres) distinctGenres.add(genre);
    distinctReleaseYears.add(title.releaseYear);

    const { grade, rawContent, synopsis } = reviewsMarkdown.find(
      (reviewsmarkdown) => {
        return reviewsmarkdown.slug === title.slug;
      },
    )!;

    distinctReviewYears.add(
      title.reviewDate.toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
      }),
    );

    return {
      ...title,
      grade,
      rawContent,
      releaseSequence: releaseSequenceMap.get(title.imdbId)!,
      synopsis,
    };
  });

  return {
    distinctGenres: [...distinctGenres].toSorted((a, b) =>
      collator.compare(a, b),
    ),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    reviews,
  };
}
