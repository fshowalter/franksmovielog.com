import { getBackdropImageProps } from "~/api/backdrops";
import { castAndCrewMember } from "~/api/castAndCrew";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { Props } from "./CastAndCrewMember";

function deck(value: Props["value"]) {
  const creditString = new Intl.ListFormat().format(value.creditedAs);

  const creditList =
    creditString.charAt(0).toUpperCase() + creditString.slice(1);

  const watchlistTitleCount =
    value.reviewCount === value.totalCount
      ? ""
      : ` and ${value.totalCount - value.reviewCount} watchlist`;

  const titles =
    value.reviewCount === 1 && value.totalCount - value.reviewCount < 2
      ? "title"
      : `titles`;

  return `${creditList} with ${value.reviewCount} reviewed${watchlistTitleCount} ${titles}.`;
}

export async function getProps(slug: string): Promise<Props> {
  const { distinctReleaseYears, member } = await castAndCrewMember(slug);

  member.titles.sort((a, b) =>
    a.releaseSequence.localeCompare(b.releaseSequence),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      member.slug,
      BackdropImageConfig,
    ),
    deck: deck(member),
    distinctReleaseYears,
    initialSort: "release-date-asc",
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
    value: member,
  };
}
