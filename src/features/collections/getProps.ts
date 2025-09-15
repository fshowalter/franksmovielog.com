import type { BackdropImageProps } from "~/api/backdrops";

import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { allCollections } from "~/api/collections";
import { AvatarListItemImageConfig } from "~/components/avatar-list/AvatarListItem";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";

import type { CollectionsProps } from "./Collections";
import type { CollectionsValue } from "./Collections";

type PageProps = CollectionsProps & {
  backdropImageProps: BackdropImageProps;
  deck: string;
};

export async function getProps(): Promise<PageProps> {
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
    backdropImageProps: await getBackdropImageProps(
      "collections",
      BackdropImageConfig,
    ),
    deck: `"Okay ramblers, let's get rambling."`,
    initialSort: "name-asc",
    values,
  };
}
