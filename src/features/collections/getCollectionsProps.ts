import { getAvatarImageProps } from "~/api/avatars";
import { allCollections } from "~/api/collections";
import { AvatarListItemImageConfig } from "~/components/avatar-list/AvatarListItem";

import type { CollectionsProps } from "./Collections";
import type { CollectionsValue } from "./Collections";

export async function getCollectionsProps(): Promise<CollectionsProps> {
  const { collections } = await allCollections();

  const values = await Promise.all(
    collections.map(async (collection) => {
      const listItemValue: CollectionsValue = {
        avatarImageProps: await getAvatarImageProps(
          collection.slug,
          AvatarListItemImageConfig,
        ),
        name: collection.name,
        reviewCount: collection.reviewCount,
        slug: collection.slug,
      };

      return listItemValue;
    }),
  );

  return {
    initialSort: "name-asc",
    values,
  };
}
