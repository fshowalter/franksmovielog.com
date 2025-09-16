import type { BackdropImageProps } from "~/api/backdrops";

import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { allCastAndCrew } from "~/api/cast-and-crew";
import { AvatarListItemImageConfig } from "~/components/avatar-list/AvatarListItem";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";

import type { CastAndCrewProps } from "./CastAndCrew";
import type { CastAndCrewValue } from "./CastAndCrew";

type PageProps = CastAndCrewProps & {
  backdropImageProps: BackdropImageProps;
  deck: string;
  metaDescription: string;
};

export async function getProps(): Promise<PageProps> {
  const { castAndCrew } = await allCastAndCrew();

  const values = await Promise.all(
    castAndCrew.map(async (member) => {
      const value: CastAndCrewValue = {
        avatarImageProps: await getAvatarImageProps(
          member.slug,
          AvatarListItemImageConfig,
        ),
        creditedAs: member.creditedAs,
        name: member.name,
        reviewCount: member.reviewCount,
        slug: member.slug,
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
    metaDescription:
      "A sortable index of directors, performers, and writers who contributed to the movies reviewed on this site. Sort by name or review count.",
    values,
  };
}
