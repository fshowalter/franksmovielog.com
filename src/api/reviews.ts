import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";

import { collator } from "~/utils/collator";

import type { ReviewedTitleJson } from "./data/reviewedTitlesJson";
import type { MarkdownReview } from "./data/reviewsMarkdown";
import type { MarkdownViewing } from "./data/viewingsMarkdown";

import { allReviewedTitlesJson } from "./data/reviewedTitlesJson";
import { allReviewsMarkdown } from "./data/reviewsMarkdown";
import { perfLogger } from "./data/utils/performanceLogger";
import { allViewingsMarkdown } from "./data/viewingsMarkdown";
import { linkReviewedTitles } from "./utils/linkReviewedTitles";
import { getHtml } from "./utils/markdown/getHtml";
import { rootAsSpan } from "./utils/markdown/rootAsSpan";

// Cache at API level - works better with Astro's build process
let cachedViewingsMarkdown: MarkdownViewing[];
let cachedMarkdownReviews: MarkdownReview[];
let cachedReviewedTitlesJson: ReviewedTitleJson[];
let cachedReviews: Reviews;
const cachedExcerpts: Record<string, string> = {};
const cachedMostRecent: Record<number, Review[]> = {};

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;

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
    if (ENABLE_CACHE) cachedReviewedTitlesJson = reviewedTitlesJson;

    const reviews = await parseReviewedTitlesJson(reviewedTitlesJson);
    if (ENABLE_CACHE) cachedReviews = reviews;
    return reviews;
  });
}

export async function loadContent<
  T extends {
    excerptPlainText: string;
    imdbId: string;
    rawContent: string;
    title: string;
  },
>(review: T): Promise<ReviewContent & T> {
  return await perfLogger.measure("loadContent", async () => {
    const viewingsMarkdown =
      cachedViewingsMarkdown || (await allViewingsMarkdown());
    const reviewedTitlesJson = await allReviewedTitlesJson();

    const viewings = viewingsMarkdown
      .filter((viewing) => {
        return viewing.imdbId === review.imdbId;
      })
      .reverse()
      .map((viewing) => {
        return {
          ...viewing,
          mediumNotes: getHtmlAsSpan(viewing.mediumNotesRaw, reviewedTitlesJson),
          venueNotes: getHtmlAsSpan(viewing.venueNotesRaw, reviewedTitlesJson),
          viewingNotes: getHtml(viewing.viewingNotesRaw, reviewedTitlesJson),
        };
      });

    return {
      ...review,
      content: getHtml(review.rawContent, reviewedTitlesJson),
      excerptPlainText: review.excerptPlainText,
      viewings,
    };
  });
}

export async function loadExcerptHtml<T extends { slug: string }>(
  review: T,
): Promise<ReviewExcerpt & T> {
  return await perfLogger.measure("loadExcerptHtml", async () => {
    const reviewsMarkdown = cachedMarkdownReviews || (await allReviewsMarkdown());

    const { excerptHtml } = reviewsMarkdown.find((markdown) => {
      return markdown.slug === review.slug;
    })!;

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

  const reviews = reviewedTitlesJson.map((title) => {
    for (const genre of title.genres) distinctGenres.add(genre);
    distinctReleaseYears.add(title.releaseYear);

    const {
      contentPlainText,
      excerptHtml,
      excerptPlainText,
      grade,
      rawContent,
      synopsis,
    } = reviewsMarkdown.find((reviewsmarkdown) => {
      return reviewsmarkdown.slug === title.slug;
    })!;

    distinctReviewYears.add(
      title.reviewDate.toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
      }),
    );

    return {
      ...title,
      contentPlainText,
      excerptHtml,
      excerptPlainText,
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
