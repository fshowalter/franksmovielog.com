import { AvatarListItemImageConfig } from "src/components/avatar-list/AvatarListItem";

import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";

import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { castAndCrewMember } from "~/api/cast-and-crew";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";
import { displayDate } from "~/utils/displayDate";

import type { CastAndCrewMemberTitlesProps } from "./CastAndCrewMemberTitles";

type PageProps = CastAndCrewMemberTitlesProps & {
  avatarImageProps: AvatarImageProps | undefined;
  backdropImageProps: BackdropImageProps;
  deck: string;
  metaDescription: string;
  name: string;
};

export async function getProps(slug: string): Promise<PageProps> {
  const { distinctGenres, distinctReleaseYears, distinctReviewYears, member } =
    await castAndCrewMember(slug);

  return {
    avatarImageProps: await getAvatarImageProps(
      member.slug,
      AvatarListItemImageConfig,
    ),
    backdropImageProps: await getBackdropImageProps(
      member.slug,
      BackdropImageConfig,
    ),
    deck: deck(member),
    distinctCreditKinds: member.creditedAs,
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "release-date-asc",
    metaDescription: metaDescription(member),
    name: member.name,
    values: await Promise.all(
      member.titles.map(async (title) => {
        return {
          ...title,
          posterImageProps: await getFluidWidthPosterImageProps(
            title.slug,
            PosterListItemImageConfig,
          ),
          reviewDisplayDate: displayDate(title.reviewDate),
          reviewSequence: title.reviewSequence,
          reviewYear: title.reviewDate
            ? new Date(title.reviewDate).toLocaleDateString("en-US", {
                timeZone: "UTC",
                year: "numeric",
              })
            : "",
        };
      }),
    ),
  };
}

function deck(value: {
  creditedAs: string[];
  reviewCount: number;
  titleCount: number;
}) {
  const creditString = new Intl.ListFormat().format(value.creditedAs);

  const creditList =
    creditString.charAt(0).toUpperCase() + creditString.slice(1);

  const watchlistTitleCount =
    value.reviewCount === value.titleCount
      ? ""
      : ` and ${value.titleCount - value.reviewCount} watchlist`;

  const titles =
    value.reviewCount === 1 && value.titleCount - value.reviewCount < 2
      ? "title"
      : `titles`;

  return `${creditList} with ${value.reviewCount} reviewed${watchlistTitleCount} ${titles}.`;
}

function metaDescription(value: { creditedAs: string[]; name: string }) {
  const creditMap: Record<string, string> = {
    director: "directed by",
    performer: "with",
    writer: "written by",
  };

  const creditString = new Intl.ListFormat("en", {
    type: "disjunction",
  }).format(value.creditedAs.map((credit) => creditMap[credit]));

  return `Reviews of movies ${creditString} ${value.name}. Sort reviews by best or worst, newest or oldest. Filter by credit kind, year, or title.`;
}
