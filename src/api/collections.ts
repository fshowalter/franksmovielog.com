import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import {
  allCollectionsJson,
  type CollectionJson,
} from "./data/collectionsJson";
import { emToQuotes } from "./utils/markdown/emToQuotes";
import { rootAsSpan } from "./utils/markdown/rootAsSpan";

export type Collection = CollectionJson & {};

export type CollectionWithDetails = Collection & {
  descriptionHtml: null | string;
};

export async function allCollections(): Promise<{
  collections: Collection[];
  distinctReleaseYears: string[];
}> {
  const collections = await allCollectionsJson();
  const releaseYears = new Set<string>();

  for (const collection of collections) {
    for (const title of collection.titles) {
      releaseYears.add(title.year);
    }
  }

  return {
    collections: collections,
    distinctReleaseYears: [...releaseYears].toSorted(),
  };
}

export async function collectionDetails(slug: string): Promise<{
  collection: CollectionWithDetails;
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
}> {
  const collections = await allCollectionsJson();
  const collection = collections.find((value) => value.slug === slug)!;

  const releaseYears = new Set<string>();
  const reviewYears = new Set<string>();

  for (const title of collection.titles) {
    releaseYears.add(title.year);

    if (title.reviewDate) {
      reviewYears.add(
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
    distinctReleaseYears: [...releaseYears].toSorted(),
    distinctReviewYears: [...reviewYears].toSorted(),
  };
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
