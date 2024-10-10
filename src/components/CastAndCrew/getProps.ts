import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { allCastAndCrew } from "~/api/castAndCrew";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemAvatarImageConfig } from "~/components/ListItemAvatar";

import type { Props } from "./CastAndCrew";
import type { ListItemValue } from "./CastAndCrew";

export async function getProps(): Promise<Props> {
  const { castAndCrew } = await allCastAndCrew();

  castAndCrew.sort((a, b) => a.name.localeCompare(b.name));

  const values = await Promise.all(
    castAndCrew.map(async (member) => {
      const value: ListItemValue = {
        avatarImageProps: await getAvatarImageProps(
          member.slug,
          ListItemAvatarImageConfig,
        ),
        creditedAs: member.creditedAs,
        name: member.name,
        reviewCount: member.reviewCount,
        slug: member.slug,
        totalCount: member.totalCount,
      };

      return value;
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "cast-and-crew",
      BackdropImageConfig,
    ),
    deck: '"Round up the usual suspects."',
    initialSort: "name-asc",
    values,
  };
}
