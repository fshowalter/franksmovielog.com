import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import { renderExcerpt, renderMarkdown, renderPlainText } from "markdown-utils";
import path from "node:path";

import { GRADE_VALUES, GRADES, gradeToValue } from "~/utils/grades";

import { CONTENT_ROOT } from "./contentRoot";
import { loadMarkdownDirectory } from "./utils/loadMarkdownDirectory";

const ReviewSchema = z.object({
  date: z.coerce.date(),
  description: z.string(),
  excerptHtml: z.string(),
  grade: z.enum(GRADES),
  gradeValue: z.literal(GRADE_VALUES),
  html: z.string(),
  reviewedTitle: reference("reviewedTitles"),
  slug: z.string(),
  synopsis: z.optional(z.string()),
});

const ReviewFrontmatterSchema = z.object({
  grade: z.enum(GRADES),
});

export const reviews = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadMarkdownDirectory({
        buildData: ({ frontmatter, source }) => {
          const { grade } = ReviewFrontmatterSchema.parse(frontmatter);
          return {
            date: frontmatter.date,
            description: renderPlainText(source),
            excerptHtml: renderExcerpt(frontmatter, source),
            grade: grade,
            gradeValue: gradeToValue(grade),
            html: renderMarkdown(source),
            reviewedTitle: frontmatter.slug,
            slug: frontmatter.slug,
            synopsis: frontmatter.synopsis,
          };
        },
        directoryPath: path.join(CONTENT_ROOT, "reviews"),
        loaderContext,
      }),
    name: "reviews-loader",
  },
  schema: ReviewSchema,
});
