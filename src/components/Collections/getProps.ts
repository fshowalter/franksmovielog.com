import type { BackdropImageProps } from "~/api/backdrops";

import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { allCollections } from "~/api/collections";
import { AvatarListItemImageConfig } from "~/components/AvatarList";
import { BackdropImageConfig } from "~/components/Backdrop";

import type { Props } from "./Collections";
import type { ListItemValue } from "./Collections";

type PageProps = Props & {
  backdropImageProps: BackdropImageProps;
  deck: string;
};

export async function getProps(): Promise<PageProps> {
  const { collections } = await allCollections();

  const values = await Promise.all(
    collections.map(async (collection) => {
      const listItemValue: ListItemValue = {
        avatarImageProps: await getAvatarImageProps(
          collection.slug,
          AvatarListItemImageConfig,
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
