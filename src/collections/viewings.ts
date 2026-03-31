import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";

import { CONTENT_ROOT } from "./contentRoot";
import { getBaseMarkdownProcessor } from "./utils/getBaseMarkdownProcessor";
import { loadMarkdownDirectory } from "./utils/loadMarkdownDirectory";
import { rootAsSpan } from "./utils/markdown-plugins/rootAsSpan";
import { markdownToHtml } from "./utils/markdownToHtml";

const ViewingFrontmatterSchema = z
  .object({
    date: z.coerce.date(),
    imdbId: z.string(),
    medium: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    mediumNotes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    sequence: z.number(),
    slug: z.string(),
    venue: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    venueNotes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
  })
  .transform(
    ({
      date,
      imdbId,
      medium,
      mediumNotes,
      sequence,
      slug,
      venue,
      venueNotes,
    }) => {
      // fix zod making anything with undefined optional
      return {
        date,
        imdbId,
        medium,
        mediumNotes,
        sequence,
        slug,
        venue,
        venueNotes,
      };
    },
  );

/** Inline span HTML pipeline — wraps in <span>, no linkReviewedWorks */
function toInlineSpanHtml(content: string): string {
  return getBaseMarkdownProcessor()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rootAsSpan)
    .use(rehypeStringify)
    .processSync(content)
    .toString();
}

const ViewingSchema = z
  .object({
    body: z.string(),
    date: z.coerce.date(),
    imdbId: z.string(),
    medium: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    mediumNotes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    mediumNotesHtml: z.string().optional(),
    sequence: z.number(),
    slug: z.string(),
    venue: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    venueNotes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    venueNotesHtml: z.string().optional(),
    viewingNotesHtml: z.string().optional(),
  })
  .transform(
    ({
      body,
      date,
      imdbId,
      medium,
      mediumNotes,
      mediumNotesHtml,
      sequence,
      slug,
      venue,
      venueNotes,
      venueNotesHtml,
      viewingNotesHtml,
    }) => {
      // fix zod making anything with undefined optional
      return {
        body,
        date,
        imdbId,
        medium,
        mediumNotes,
        mediumNotesHtml,
        sequence,
        slug,
        venue,
        venueNotes,
        venueNotesHtml,
        viewingNotesHtml,
      };
    },
  );

export const viewings = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadMarkdownDirectory({
        buildData: ({ body, frontmatter }) => {
          const parsedFrontmatter = ViewingFrontmatterSchema.parse(frontmatter);

          return {
            body,
            date: parsedFrontmatter.date,
            imdbId: parsedFrontmatter.imdbId,
            medium: parsedFrontmatter.medium,
            mediumNotes: parsedFrontmatter.mediumNotes,
            mediumNotesHtml: parsedFrontmatter.mediumNotes?.trim()
              ? toInlineSpanHtml(parsedFrontmatter.mediumNotes)
              : undefined,
            sequence: parsedFrontmatter.sequence,
            slug: parsedFrontmatter.slug,
            venue: parsedFrontmatter.venue,
            venueNotes: parsedFrontmatter.venueNotes,
            venueNotesHtml: parsedFrontmatter.venueNotes?.trim()
              ? toInlineSpanHtml(parsedFrontmatter.venueNotes)
              : undefined,
            viewingNotesHtml: body.trim() ? markdownToHtml(body) : undefined,
          };
        },
        directoryPath: path.join(CONTENT_ROOT, "viewings"),
        loaderContext,
      }),
    name: "viewings-loader",
  },
  schema: ViewingSchema,
});
