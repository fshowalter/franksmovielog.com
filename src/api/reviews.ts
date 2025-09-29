import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import { ENABLE_CACHE } from "~/utils/cache";
import { collator } from "~/utils/collator";
import { perfLogger } from "~/utils/performanceLogger";

import type { ReviewedTitleJson } from "./data/reviewed-titles-json";
import type { MarkdownReview } from "./data/reviews-markdown";
import type { MarkdownViewing } from "./data/viewings-markdown";

import { allReviewedTitlesJson } from "./data/reviewed-titles-json";
import { allReviewsMarkdown } from "./data/reviews-markdown";
import { allViewingsMarkdown } from "./data/viewings-markdown";
import { createReleaseSequenceMap } from "./utils/createReleaseSequenceMap";
import { linkReviewedTitles } from "./utils/linkReviewedTitles";
import { getHtml } from "./utils/markdown/getHtml";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";
import { rootAsSpan } from "./utils/markdown/rootAsSpan";
import { trimToExcerpt } from "./utils/markdown/trimToExcerpt";

let cachedViewingsMarkdown: MarkdownViewing[];
let cachedMarkdownReviews: MarkdownReview[];
let cachedReviewedTitlesJson: ReviewedTitleJson[];
let cachedReviews: Reviews;
const cachedExcerptHtml: Map<string, string> = new Map();

/**
 * Review combining markdown content with title metadata.
 */
export type Review = Omit<MarkdownReview, "date"> & ReviewedTitleJson;

/**
 * Review content with excerpt and viewing history.
 */
export type ReviewContent = {
  content: string | undefined;
  excerptPlainText: string;
  viewings: ReviewViewing[];
};

type ReviewExcerpt = {
  excerpt: string;
};

type Reviews = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  reviews: (Review & { releaseSequence: number })[];
};

type ReviewViewing = MarkdownViewing & {
  mediumNotes: string | undefined;
  venueNotes: string | undefined;
  viewingNotes: string | undefined;
};

/**
 * Retrieves all reviews with distinct metadata for filtering.
 * @returns Object containing all reviews and distinct values for genres, release years, and review years
 */
export async function allReviews(): Promise<Reviews> {
  return await perfLogger.measure("allReviews", async () => {
    if (cachedReviews) {
      return cachedReviews;
    }

    const reviewedTitlesJson =
      cachedReviewedTitlesJson || (await allReviewedTitlesJson());
    if (ENABLE_CACHE && !cachedReviewedTitlesJson) {
      cachedReviewedTitlesJson = reviewedTitlesJson;
    }

    const reviews = await parseReviewedTitlesJson(reviewedTitlesJson);
    if (ENABLE_CACHE) {
      cachedReviews = reviews;
    }

    return reviews;
  });
}

/**
 * Converts raw markdown content to plain text, removing formatting and footnotes.
 * @param rawContent - Raw markdown content string
 * @returns Plain text version of the content
 */
export function getContentPlainText(rawContent: string): string {
  return getMastProcessor()
    .use(removeFootnotes)
    .use(strip)
    .processSync(rawContent)
    .toString();
}

/**
 * Loads and processes full review content including HTML conversion and viewing details.
 * @param review - Review object with IMDB ID, raw content, and title
 * @returns Review with processed content, excerpt, and viewing information
 */
export async function loadContent<
  T extends { imdbId: string; rawContent: string; title: string },
>(review: T): Promise<ReviewContent & T> {
  return await perfLogger.measure("loadContent", async () => {
    const viewingsMarkdown =
      cachedViewingsMarkdown || (await allViewingsMarkdown());
    if (ENABLE_CACHE && !cachedViewingsMarkdown) {
      cachedViewingsMarkdown = viewingsMarkdown;
    }

    const reviewedTitlesJson =
      cachedReviewedTitlesJson || (await allReviewedTitlesJson());
    if (ENABLE_CACHE && !cachedReviewedTitlesJson) {
      cachedReviewedTitlesJson = reviewedTitlesJson;
    }

    const excerptPlainText = getMastProcessor()
      .use(removeFootnotes)
      .use(trimToExcerpt)
      .use(strip)
      .processSync(review.rawContent)
      .toString();

    const viewings = viewingsMarkdown
      .filter((viewing) => {
        return viewing.imdbId === review.imdbId;
      })
      .reverse()
      .map((viewing) => {
        return {
          ...viewing,
          mediumNotes: getHtmlAsSpan(
            viewing.mediumNotesRaw,
            reviewedTitlesJson,
          ),
          venueNotes: getHtmlAsSpan(viewing.venueNotesRaw, reviewedTitlesJson),
          viewingNotes: getHtml(viewing.viewingNotesRaw, reviewedTitlesJson),
        };
      });

    return {
      ...review,
      content: getHtml(review.rawContent, reviewedTitlesJson),
      excerptPlainText,
      viewings,
    };
  });
}

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

function getHtmlAsSpan(
  content: string | undefined,
  reviewedTitles: { imdbId: string; slug: string }[],
) {
  if (!content) {
    return;
  }

  const html = getMastProcessor()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rootAsSpan)
    .use(rehypeStringify)
    .processSync(content)
    .toString();

  return linkReviewedTitles(html, reviewedTitles);
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
