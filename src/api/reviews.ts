import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

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
import {
  EXCERPT_SEPARATOR,
  trimToExcerpt,
} from "./utils/markdown/trimToExcerpt";

let cachedViewingsMarkdown: MarkdownViewing[] | null = null;
let cachedMarkdownReviews: MarkdownReview[] | null = null;
let cachedReviewedTitlesJson: null | ReviewedTitleJson[] = null;
let cachedReviews: null | Reviews = null;

if (import.meta.env.MODE !== "development") {
  cachedViewingsMarkdown = await allViewingsMarkdown();
  cachedReviewedTitlesJson = await allReviewedTitlesJson();
  cachedMarkdownReviews = await allReviewsMarkdown();
}

type ReviewViewing = {
  mediumNotes: null | string;
  venueNotes: null | string;
  viewingNotes: null | string;
} & MarkdownViewing;

export type Review = {} & MarkdownReview & ReviewedTitleJson;

type Reviews = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  reviews: Review[];
};

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}

function getHtmlAsSpan(
  content: null | string,
  reviewedTitles: { imdbId: string; slug: string }[],
) {
  if (!content) {
    return null;
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

export type ReviewExcerpt = {
  excerpt: string;
};

export async function loadExcerptHtml<T extends { slug: string }>(
  review: T,
): Promise<ReviewExcerpt & T> {
  const reviewsMarkdown = cachedMarkdownReviews || (await allReviewsMarkdown());
  const reviewedTitlesJson =
    cachedReviewedTitlesJson || (await allReviewedTitlesJson());

  const { rawContent } = reviewsMarkdown.find((markdown) => {
    return markdown.slug === review.slug;
  })!;

  let excerptHtml = getMastProcessor()
    .use(removeFootnotes)
    .use(trimToExcerpt)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .processSync(rawContent)
    .toString();

  const hasExcerptBreak = rawContent.includes(EXCERPT_SEPARATOR);

  if (hasExcerptBreak) {
    excerptHtml = excerptHtml.replace(/\n+$/, "");
    excerptHtml = excerptHtml.replace(
      /<\/p>$/,
      ` <a class="!no-underline uppercase whitespace-nowrap font-normal font-sans text-accent text-xs  leading-none hover:!underline" href="/reviews/${review.slug}/">Continue reading...</a></p>`,
    );
  }

  return {
    ...review,
    excerpt: linkReviewedTitles(excerptHtml, reviewedTitlesJson),
  };
}

export type ReviewContent = {
  content: null | string;
  excerptPlainText: string;
  viewings: ReviewViewing[];
};

export async function loadContent<
  T extends { imdbId: string; rawContent: string; title: string },
>(review: T): Promise<ReviewContent & T> {
  const viewingsMarkdown =
    cachedViewingsMarkdown || (await allViewingsMarkdown());
  const reviewedTitlesJson = await allReviewedTitlesJson();

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
    .map((viewing) => {
      return {
        ...viewing,
        mediumNotes: getHtmlAsSpan(viewing.mediumNotesRaw, reviewedTitlesJson),
        venueNotes: getHtmlAsSpan(viewing.venueNotesRaw, reviewedTitlesJson),
        viewingNotes: getHtml(viewing.viewingNotesRaw, reviewedTitlesJson),
      };
    });

  if (viewings.length === 0) {
    throw new Error(
      `No markdown viewings found with imdb_id ${review.imdbId} for title "${review.title}"`,
    );
  }

  return {
    ...review,
    content: getHtml(review.rawContent, reviewedTitlesJson),
    excerptPlainText,
    viewings,
  };
}

async function parseReviewedTitlesJson(
  reviewedTitlesJson: ReviewedTitleJson[],
): Promise<Reviews> {
  const distinctReviewYears = new Set<string>();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();
  const reviewsMarkdown = cachedMarkdownReviews || (await allReviewsMarkdown());

  const reviews = reviewedTitlesJson.map((title) => {
    title.genres.forEach((genre) => distinctGenres.add(genre));
    distinctReleaseYears.add(title.year);

    const { date, grade, rawContent } = reviewsMarkdown.find(
      (reviewsmarkdown) => {
        return reviewsmarkdown.slug === title.slug;
      },
    )!;

    distinctReviewYears.add(
      date.toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
      }),
    );

    return {
      ...title,
      date,
      grade,
      rawContent,
    };
  });

  return {
    distinctGenres: Array.from(distinctGenres).toSorted(),
    distinctReleaseYears: Array.from(distinctReleaseYears).toSorted(),
    distinctReviewYears: Array.from(distinctReviewYears).toSorted(),
    reviews,
  };
}

export async function mostRecentReviews(limit: number) {
  const reviewedTitlesJson =
    cachedReviewedTitlesJson || (await allReviewedTitlesJson());

  reviewedTitlesJson.sort((a, b) => b.sequence.localeCompare(a.sequence));
  const slicedTitles = reviewedTitlesJson.slice(0, limit);

  const { reviews } = await parseReviewedTitlesJson(slicedTitles);

  return reviews;
}

export async function allReviews(): Promise<Reviews> {
  if (cachedReviews) {
    return cachedReviews;
  }
  const reviewedTitlesJson =
    cachedReviewedTitlesJson || (await allReviewedTitlesJson());
  const reviews = await parseReviewedTitlesJson(reviewedTitlesJson);

  if (!import.meta.env.DEV) {
    cachedReviews = reviews;
  }

  return reviews;
}
