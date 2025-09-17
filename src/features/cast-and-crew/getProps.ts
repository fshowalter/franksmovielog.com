import { getAvatarImageProps } from "~/api/avatars";
import { allCastAndCrew } from "~/api/cast-and-crew";
import { AvatarListItemImageConfig } from "~/components/avatar-list/AvatarListItem";

import type { CastAndCrewProps } from "./CastAndCrew";
import type { CastAndCrewValue } from "./CastAndCrew";

export async function getProps(): Promise<CastAndCrewProps> {
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
    initialSort: "name-asc",
    values,
  };
}
