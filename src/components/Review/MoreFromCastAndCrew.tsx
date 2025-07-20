import type { Review } from "~/api/reviews";
import type { StillImageProps } from "~/api/stills";

import { MoreReviews } from "~/components/MoreReviews";
import { SubHeading } from "~/components/SubHeading";

type CastAndCrewMember = Omit<Review["moreCastAndCrew"][number], "titles"> & {
  titles: CastAndCrewMemberTitle[];
};

type CastAndCrewMemberTitle =
  Review["moreCastAndCrew"][number]["titles"][number] & {
    excerpt: string;
    stillImageProps: StillImageProps;
  };

type Props = {
  values: CastAndCrewMember[];
};

export function MoreFromCastAndCrew({ values }: Props) {
  return values.map((value) => (
    <MoreReviews key={value.slug} values={value.titles}>
      <SubHeading as="h2">
        {leadTextForCreditKind(value.creditKind)}{" "}
        <a
          className={`
            inline-block origin-left transform-gpu text-accent
            transition-transform
            hover:scale-105
          `}
          href={`/cast-and-crew/${value.slug}/`}
        >
          {value.name}
        </a>
      </SubHeading>
    </MoreReviews>
  ));
}

function leadTextForCreditKind(
  creditKind: "director" | "performer" | "writer",
): string {
  switch (creditKind) {
    case "director": {
      return "More directed by";
    }
    case "performer": {
      return "More with";
    }
    case "writer": {
      return "More written by";
    }
    // no-default
  }
}
