import { getAvatarImageProps } from "src/api/avatars";
import { castAndCrewMember } from "src/api/castAndCrew";
import { getFluidWidthPosterImageProps } from "src/api/posters";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import type { Props } from "./CastAndCrewMember";
import { AvatarImageConfig } from "./CastAndCrewMember";

export async function getProps(slug: string): Promise<Props> {
  const { member, distinctReleaseYears } = await castAndCrewMember(slug);

  member.titles.sort((a, b) =>
    a.releaseSequence.localeCompare(b.releaseSequence),
  );

  return {
    value: member,
    titles: await Promise.all(
      member.titles.map(async (title) => {
        return {
          ...title,
          posterImageProps: await getFluidWidthPosterImageProps(
            title.slug,
            ListItemPosterImageConfig,
          ),
        };
      }),
    ),
    avatarImageProps: await getAvatarImageProps(member.slug, AvatarImageConfig),
    distinctReleaseYears,
    initialSort: "release-date-asc",
  };
}
