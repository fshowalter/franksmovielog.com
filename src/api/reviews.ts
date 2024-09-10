import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import type { ReviewedTitleJson } from "./data/reviewedTitlesJson";
import { allReviewedTitlesJson } from "./data/reviewedTitlesJson";
import type { MarkdownReview } from "./data/reviewsMarkdown";
import { allReviewsMarkdown } from "./data/reviewsMarkdown";
import type { MarkdownViewing } from "./data/viewingsMarkdown";
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
let cachedReviewedTitlesJson: ReviewedTitleJson[] | null = null;
let cachedReviews: Reviews | null = null;

if (import.meta.env.MODE !== "development") {
  cachedViewingsMarkdown = await allViewingsMarkdown();
  cachedReviewedTitlesJson = await allReviewedTitlesJson();
  cachedMarkdownReviews = await allReviewsMarkdown();
}

interface ReviewViewing extends MarkdownViewing {
  venueNotes: string | null;
  mediumNotes: string | null;
  viewingNotes: string | null;
}

export interface Review extends ReviewedTitleJson, MarkdownReview {}

interface Reviews {
  reviews: Review[];
  distinctReviewYears: string[];
  distinctReleaseYears: string[];
  distinctGenres: string[];
}

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}

function getHtmlAsSpan(
  content: string | null,
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

export interface ReviewWithExcerpt extends Review {
  excerpt: string;
}

export async function loadExcerptHtml(
  review: Review,
): Promise<ReviewWithExcerpt> {
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
      ` <a class="!no-underline uppercase whitespace-nowrap font-normal font-sans-caps text-accent text-xs tracking-[1.1px] leading-none" href="/reviews/${review.slug}/">Continue reading...</a></p>`,
    );
  }

  return {
    ...review,
    excerpt: linkReviewedTitles(excerptHtml, reviewedTitlesJson),
  };
}

export interface ReviewWithContent extends Review {
  viewings: ReviewViewing[];
  excerptPlainText: string;
  content: string | null;
}

export async function loadContent(review: Review): Promise<ReviewWithContent> {
  console.log(review);
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
        venueNotes: getHtmlAsSpan(viewing.venueNotesRaw, reviewedTitlesJson),
        mediumNotes: getHtmlAsSpan(viewing.mediumNotesRaw, reviewedTitlesJson),
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
    viewings,
    content: getHtml(review.rawContent, reviewedTitlesJson),
    excerptPlainText,
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

    const { rawContent, grade, date } = reviewsMarkdown.find(
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
      rawContent,
      grade,
      date,
    };
  });

  return {
    reviews,
    distinctGenres: Array.from(distinctGenres).toSorted(),
    distinctReleaseYears: Array.from(distinctReleaseYears).toSorted(),
    distinctReviewYears: Array.from(distinctReviewYears).toSorted(),
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
