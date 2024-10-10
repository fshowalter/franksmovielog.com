import { getAvatarImageProps } from "src/api/avatars";
import { getBackdropImageProps } from "src/api/backdrops";
import { allCollections } from "src/api/collections";
import { BackdropImageConfig } from "src/components/Backdrop";
import { ListItemAvatarImageConfig } from "src/components/ListItemAvatar";

import type { Props } from "./Collections";

import { type ListItemValue } from "./Collections";

export async function getProps(): Promise<Props> {
  const { collections } = await allCollections();

  collections.sort((a, b) => a.name.localeCompare(b.name));

  const values = await Promise.all(
    collections.map(async (collection) => {
      const listItemValue: ListItemValue = {
        avatarImageProps: await getAvatarImageProps(
          collection.slug,
          ListItemAvatarImageConfig,
        ),
        name: collection.name,
        reviewCount: collection.reviewCount,
        slug: collection.slug,
        titleCount: collection.titleCount,
      };

      return listItemValue;
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "collections",
      BackdropImageConfig,
    ),
    deck: `"Okay ramblers, let's get rambling."`,
    initialSort: "name-asc",
    values,
  };
}
