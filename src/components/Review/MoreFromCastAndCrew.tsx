import type { Review } from "src/api/reviews";
import type { StillImageProps } from "src/api/stills";
import { MoreReviews } from "src/components/MoreReviews";
import { SubHeading } from "src/components/SubHeading";

type CastAndCrewMemberTitle =
  Review["moreCastAndCrew"][number]["titles"][number] & {
    stillImageProps: StillImageProps;
    excerpt: string;
  };

type CastAndCrewMember = Omit<Review["moreCastAndCrew"][number], "titles"> & {
  titles: CastAndCrewMemberTitle[];
};

type Props = {
  values: CastAndCrewMember[];
};

export function MoreFromCastAndCrew({ values }: Props) {
  return values.map((value) => (
    <MoreReviews key={value.slug} values={value.titles}>
      <SubHeading as="h2">
        {leadTextForCreditKind(value.creditKind)}{" "}
        <a href={`/cast-and-crew/${value.slug}`} className="text-accent">
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
