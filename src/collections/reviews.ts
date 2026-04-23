import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import path from "node:path";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";

import { GRADE_VALUES, GRADES, gradeToValue } from "~/utils/grades";

import { CONTENT_ROOT } from "./contentRoot";
import { getBaseMarkdownProcessor } from "./utils/getBaseMarkdownProcessor";
import { loadMarkdownDirectory } from "./utils/loadMarkdownDirectory";
import { removeFootnotes } from "./utils/markdown-plugins/removeFootnotes";
import { trimToExcerpt } from "./utils/markdown-plugins/trimToExcerpt";
import { markdownToDescription } from "./utils/markdownToDescription";
import { markdownToHtml } from "./utils/markdownToHtml";

function parseExcerpt(frontmatter: Record<string, unknown>, body: string) {
  const excerptContent =
    (frontmatter.synopsis as string | undefined)?.trim() || body;

  //trim the string to the maximum length
  return getBaseMarkdownProcessor()
    .use(removeFootnotes)
    .use(trimToExcerpt)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .processSync(excerptContent)
    .toString();
}

const ReviewSchema = z.object({
  body: z.string(),
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
        buildData: ({ body, frontmatter }) => {
          const { grade } = ReviewFrontmatterSchema.parse(frontmatter);
          return {
            body,
            date: frontmatter.date,
            description: markdownToDescription(body),
            excerptHtml: parseExcerpt(frontmatter, body),
            grade: grade,
            gradeValue: gradeToValue(grade),
            html: markdownToHtml(body),
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
