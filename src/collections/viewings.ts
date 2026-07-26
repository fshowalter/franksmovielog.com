import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { parseFrontmatter, renderHtml, renderInlineHtml } from "markdown-utils";
import path from "node:path";

import { toSortDate } from "~/utils/toSortDate";

import { CONTENT_ROOT } from "./contentRoot";
import { loadMarkdownDirectory } from "./utils/loadMarkdownDirectory";

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

const ViewingSchema = z
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
        buildData: ({ frontmatter, source }) => {
          const parsedFrontmatter = ViewingFrontmatterSchema.parse(frontmatter);
          const notesHtml = renderHtml(source);

          return {
            date: parsedFrontmatter.date,
            imdbId: parsedFrontmatter.imdbId,
            medium: parsedFrontmatter.medium,
            mediumNotes: parsedFrontmatter.mediumNotes,
            mediumNotesHtml: parsedFrontmatter.mediumNotes?.trim()
              ? renderInlineHtml(parsedFrontmatter.mediumNotes)
              : undefined,
            sequence: parsedFrontmatter.sequence,
            slug: parsedFrontmatter.slug,
            venue: parsedFrontmatter.venue,
            venueNotes: parsedFrontmatter.venueNotes,
            venueNotesHtml: parsedFrontmatter.venueNotes?.trim()
              ? renderInlineHtml(parsedFrontmatter.venueNotes)
              : undefined,
            viewingNotesHtml: notesHtml.trim() ? notesHtml : undefined,
          };
        },
        directoryPath: path.join(CONTENT_ROOT, "viewings"),
        getId: (rawContent, filePath) => {
          const frontmatter = parseFrontmatter(rawContent, filePath);

          const validatedFrontmatter =
            ViewingFrontmatterSchema.parse(frontmatter);

          return `${toSortDate(validatedFrontmatter.date)}-${validatedFrontmatter.sequence.toString().padStart(2, "0")}`;
        },
        loaderContext,
      }),
    name: "viewings-loader",
  },
  schema: ViewingSchema,
});
