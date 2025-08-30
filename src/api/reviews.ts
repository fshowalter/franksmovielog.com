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

import type { ReviewedTitleJson } from "./data/reviewedTitlesJson";
import type { MarkdownReview } from "./data/reviewsMarkdown";
import type { MarkdownViewing } from "./data/viewingsMarkdown";

import { allReviewedTitlesJson } from "./data/reviewedTitlesJson";
import { allReviewsMarkdown } from "./data/reviewsMarkdown";
import { allViewingsMarkdown } from "./data/viewingsMarkdown";
import { linkReviewedTitles } from "./utils/linkReviewedTitles";
import { getHtml } from "./utils/markdown/getHtml";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";
import { rootAsSpan } from "./utils/markdown/rootAsSpan";
import { trimToExcerpt } from "./utils/markdown/trimToExcerpt";

// Cache at API level - lazy caching for better build performance
let cachedViewingsMarkdown: MarkdownViewing[];
let cachedMarkdownReviews: MarkdownReview[];
let cachedReviewedTitlesJson: ReviewedTitleJson[];
let cachedReviews: Reviews;
const cachedExcerptHtml: Map<string, string> = new Map();

// ENABLE_CACHE is now imported from utils/cache

export type Review = Omit<MarkdownReview, "date"> & ReviewedTitleJson;

export type ReviewContent = {
  content: string | undefined;
  excerptPlainText: string;
  viewings: ReviewViewing[];
};

export type ReviewExcerpt = {
  excerpt: string;
};

type Reviews = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  reviews: Review[];
};

type ReviewViewing = MarkdownViewing & {
  mediumNotes: string | undefined;
  venueNotes: string | undefined;
  viewingNotes: string | undefined;
};

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

export function getContentPlainText(rawContent: string): string {
  return getMastProcessor()
    .use(removeFootnotes)
    .use(strip)
    .processSync(rawContent)
    .toString();
}

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

export async function mostRecentReviews(limit: number) {
  return await perfLogger.measure("mostRecentReviews", async () => {
    const reviewedTitlesJson =
      cachedReviewedTitlesJson || (await allReviewedTitlesJson());
    if (ENABLE_CACHE && !cachedReviewedTitlesJson) {
      cachedReviewedTitlesJson = reviewedTitlesJson;
    }

    reviewedTitlesJson.sort((a, b) =>
      b.reviewSequence.localeCompare(a.reviewSequence),
    );
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
      synopsis,
    };
  });

  return {
    distinctGenres: [...distinctGenres].sort((a, b) => collator.compare(a, b)),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    reviews,
  };
}
