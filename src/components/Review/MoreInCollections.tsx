import type { Review } from "~/api/reviews";
import type { StillImageProps } from "~/api/stills";

import { MoreReviews } from "~/components/MoreReviews";
import { SubHeading } from "~/components/SubHeading";

type Collection = {
  titles: CollectionTitle[];
} & Omit<Review["moreCollections"][number], "titles">;

type CollectionTitle = {
  excerpt: string;
  stillImageProps: StillImageProps;
} & Review["moreCollections"][number]["titles"][number];

type Props = {
  values: Collection[];
};

export function MoreInCollections({ values }: Props) {
  return values.map((value) => (
    <MoreReviews key={value.slug} values={value.titles}>
      <SubHeading as="h2">
        More{" "}
        <a className="text-accent" href={`/collections/${value.slug}/`}>
          {value.name}
        </a>
      </SubHeading>
    </MoreReviews>
  ));
}
