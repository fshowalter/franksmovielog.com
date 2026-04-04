import type { CollectionEntry } from "astro:content";

import { getAvatarImageProps } from "~/assets/avatars";

import type { CollectionsProps } from "./Collections";
import type { CollectionsValue } from "./Collections";

/**
 * Fetches data for the collections list page including avatar images.
 * @returns Props for the Collections component with all collections
 */
export async function getCollectionsProps(
  collections: CollectionEntry<"collections">["data"][],
): Promise<CollectionsProps> {
  const values = await Promise.all(
    collections.map(async (collection) => {
      const listItemValue: CollectionsValue = {
        avatarImageProps: await getAvatarImageProps(collection.slug),
        name: collection.name,
        reviewCount: collection.reviewCount,
        slug: collection.slug,
        sortName: collection.sortName,
      };

      return listItemValue;
    }),
  );

  return {
    initialSort: "name-asc",
    values,
  };
}
