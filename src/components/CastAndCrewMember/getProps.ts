import { getBackdropImageProps } from "src/api/backdrops";
import { castAndCrewMember } from "src/api/castAndCrew";
import { getFluidWidthPosterImageProps } from "src/api/posters";
import { BackdropImageConfig } from "src/components/Backdrop";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import type { Props } from "./CastAndCrewMember";

export function deck(value: Props["value"]) {
  const creditString = new Intl.ListFormat().format(value.creditedAs);

  const creditList =
    creditString.charAt(0).toUpperCase() + creditString.slice(1);

  let watchlistTitleCount;
  if (value.reviewCount === value.totalCount) {
    watchlistTitleCount = "";
  } else {
    watchlistTitleCount = ` and ${value.totalCount - value.reviewCount} watchlist`;
  }

  let titles;

  if (value.reviewCount === 1 && value.totalCount - value.reviewCount < 2) {
    titles = "title";
  } else {
    titles = `titles`;
  }

  return `${creditList} with ${value.reviewCount} reviewed${watchlistTitleCount} ${titles}.`;
}

export async function getProps(slug: string): Promise<Props> {
  const { member, distinctReleaseYears } = await castAndCrewMember(slug);

  member.titles.sort((a, b) =>
    a.releaseSequence.localeCompare(b.releaseSequence),
  );

  return {
    value: member,
    deck: deck(member),
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
