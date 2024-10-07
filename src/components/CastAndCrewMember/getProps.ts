import { getBackdropImageProps } from "src/api/backdrops";
import { castAndCrewMember } from "src/api/castAndCrew";
import { getFluidWidthPosterImageProps } from "src/api/posters";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import { BackdropImageConfig } from "../Backdrop";
import type { Props } from "./CastAndCrewMember";

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
    backdropImageProps: await getBackdropImageProps(
      member.slug,
      BackdropImageConfig,
    ),
    distinctReleaseYears,
    initialSort: "release-date-asc",
  };
}
