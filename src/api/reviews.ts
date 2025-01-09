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
import { trimToExcerpt } from "./utils/markdown/trimToExcerpt";

let cachedViewingsMarkdown: MarkdownViewing[];
let cachedMarkdownReviews: MarkdownReview[];
let cachedReviewedTitlesJson: ReviewedTitleJson[];
let cachedReviews: Reviews;

if (import.meta.env.MODE !== "development") {
  cachedViewingsMarkdown = allViewingsMarkdown();
  cachedReviewedTitlesJson = await allReviewedTitlesJson();
  cachedMarkdownReviews = allReviewsMarkdown();
}

export type Review = MarkdownReview & ReviewedTitleJson & {};

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
  if (cachedReviews) {
    return cachedReviews;
  }
  const reviewedTitlesJson =
    cachedReviewedTitlesJson || (await allReviewedTitlesJson());
  const reviews = parseReviewedTitlesJson(reviewedTitlesJson);

  if (!import.meta.env.DEV) {
    cachedReviews = reviews;
  }

  return reviews;
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
  const viewingsMarkdown = cachedViewingsMarkdown || allViewingsMarkdown();
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
    excerptPlainText,
    viewings,
  };
}

export function loadExcerptHtml<T extends { slug: string }>(
  review: T,
): ReviewExcerpt & T {
  const reviewsMarkdown = cachedMarkdownReviews || allReviewsMarkdown();

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

  excerptHtml = excerptHtml.replace(/\n+$/, "");
  excerptHtml = excerptHtml.replace(
    /<\/p>$/,
    ` <a class="!no-underline uppercase whitespace-nowrap font-normal font-sans text-accent text-xs  leading-none hover:!underline" href="/reviews/${review.slug}/">Continue reading...</a></p>`,
  );

  return {
    ...review,
    excerpt: excerptHtml,
  };
}

export async function mostRecentReviews(limit: number) {
  const reviewedTitlesJson =
    cachedReviewedTitlesJson || (await allReviewedTitlesJson());

  reviewedTitlesJson.sort((a, b) => b.sequence.localeCompare(a.sequence));
  const slicedTitles = reviewedTitlesJson.slice(0, limit);

  const { reviews } = parseReviewedTitlesJson(slicedTitles);

  return reviews;
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

function parseReviewedTitlesJson(
  reviewedTitlesJson: ReviewedTitleJson[],
): Reviews {
  const distinctReviewYears = new Set<string>();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();
  const reviewsMarkdown = cachedMarkdownReviews || allReviewsMarkdown();

  const reviews = reviewedTitlesJson.map((title) => {
    for (const genre of title.genres) distinctGenres.add(genre);
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
    distinctGenres: [...distinctGenres].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    reviews,
  };
}
