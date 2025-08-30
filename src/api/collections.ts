import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import { ENABLE_CACHE } from "~/utils/cache";
import { perfLogger } from "~/utils/performanceLogger";

import {
  allCollectionsJson,
  type CollectionJson,
} from "./data/collectionsJson";
import { emToQuotes } from "./utils/markdown/emToQuotes";
import { rootAsSpan } from "./utils/markdown/rootAsSpan";

// Cache at API level - lazy caching for better build performance
let cachedCollectionsJson: CollectionJson[];
// ENABLE_CACHE is now imported from utils/cache

export type Collection = CollectionJson & {};

export type CollectionWithDetails = Collection & {
  descriptionHtml: string;
};

export async function allCollections(): Promise<{
  collections: Collection[];
}> {
  return await perfLogger.measure("allCollections", async () => {
    const collections = cachedCollectionsJson || (await allCollectionsJson());
    if (ENABLE_CACHE && !cachedCollectionsJson) {
      cachedCollectionsJson = collections;
    }

    return {
      collections: collections,
    };
  });
}

export async function collectionDetails(slug: string): Promise<{
  collection: CollectionWithDetails;
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
