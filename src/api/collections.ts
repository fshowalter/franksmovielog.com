import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import { ENABLE_CACHE } from "~/utils/cache";
import { perfLogger } from "~/utils/performanceLogger";

import type { CollectionJson } from "./data/collections-json";

import { allCollectionsJson } from "./data/collections-json";
import { createReleaseSequenceMap } from "./utils/createReleaseSequenceMap";
import { emToQuotes } from "./utils/markdown/emToQuotes";
import { rootAsSpan } from "./utils/markdown/rootAsSpan";

let cachedCollectionsJson: CollectionJson[];

/**
 * Collection with rendered HTML description.
 */
export type Collection = CollectionJson & {
  descriptionHtml: string;
};

/**
 * Retrieves all collections with their descriptions rendered as HTML.
 * @returns Object containing array of all collections
 */
export async function allCollections(): Promise<{
  collections: Collection[];
}> {
  return await perfLogger.measure("allCollections", async () => {
    const collections = cachedCollectionsJson || (await allCollectionsJson());
    if (ENABLE_CACHE && !cachedCollectionsJson) {
      cachedCollectionsJson = collections;
    }

    return {
      collections: collections.map((collection) => {
        return {
          ...collection,
          description: descriptionToString(collection.description),
          descriptionHtml: descriptionToHtml(collection.description),
        };
      }),
    };
  });
}

/**
 * Retrieves detailed information for a specific collection.
 * @param slug - The collection slug identifier
 * @returns Collection details with distinct genres and release years from its titles
 */
export async function collectionDetails(slug: string): Promise<{
  collection: Omit<Collection, "titles"> & {
    titles: (Collection["titles"][number] & { releaseSequence: number })[];
  };
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
}> {
  return await perfLogger.measure("collectionDetails", async () => {
    const collections = cachedCollectionsJson || (await allCollectionsJson());
    if (ENABLE_CACHE && !cachedCollectionsJson) {
      cachedCollectionsJson = collections;
    }
    const collection = collections.find((value) => value.slug === slug)!;

    const distinctReleaseYears = new Set<string>();
    const distinctReviewYears = new Set<string>();
    const distinctGenres = new Set<string>();

    const releaseSequenceMap = createReleaseSequenceMap(collection.titles);

    for (const title of collection.titles) {
      distinctReleaseYears.add(title.releaseYear);

      for (const genre of title.genres) {
        distinctGenres.add(genre);
      }

      if (title.reviewDate) {
        distinctReviewYears.add(
          new Date(title.reviewDate).toLocaleDateString("en-US", {
            timeZone: "UTC",
            year: "numeric",
          }),
        );
      }
    }

    return {
      collection: {
        ...collection,
        description: descriptionToString(collection.description),
        descriptionHtml: descriptionToHtml(collection.description),
        titles: collection.titles.map((title) => {
          return {
            ...title,
            releaseSequence: releaseSequenceMap.get(title.imdbId)!,
          };
        }),
      },
      distinctGenres: [...distinctGenres].toSorted(),
      distinctReleaseYears: [...distinctReleaseYears].toSorted(),
      distinctReviewYears: [...distinctReviewYears].toSorted(),
    };
  });
}

function descriptionToHtml(description: string) {
  return getMastProcessor()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rootAsSpan)
    .use(rehypeStringify)
    .processSync(description)
    .toString();
}

function descriptionToString(description: string) {
  return getMastProcessor()
    .use(emToQuotes)
    .use(strip)
    .processSync(description)
    .toString();
}

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}
