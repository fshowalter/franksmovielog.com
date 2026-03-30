import type { CollectionEntry } from "astro:content";

import { getAvatarImageProps } from "~/assets/avatars";
import { AvatarListItemImageConfig } from "~/components/avatar-list/AvatarListItem";

import type { CastAndCrewProps } from "./CastAndCrew";
import type { CastAndCrewValue } from "./CastAndCrew";

/**
 * Fetches data for the cast and crew list page including avatar images.
 * @returns Props for the CastAndCrew component with all cast/crew members
 */
export async function getCastAndCrewProps(
  castAndCrew: CollectionEntry<"castAndCrew">["data"][],
): Promise<CastAndCrewProps> {
  castAndCrew.sort((a, b) => a.name.localeCompare(b.name));

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
        sortName: member.name,
      };

      return value;
    }),
  );

  return {
    initialSort: "name-asc",
    values,
  };
}
