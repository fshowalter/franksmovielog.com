import type { Review } from "src/api/reviews";
import type { StillImageProps } from "src/api/stills";

import { MoreReviews } from "src/components/MoreReviews";
import { SubHeading } from "src/components/SubHeading";

type CollectionTitle = {
  excerpt: string;
  stillImageProps: StillImageProps;
} & Review["moreCollections"][number]["titles"][number];

type Collection = {
  titles: CollectionTitle[];
} & Omit<Review["moreCollections"][number], "titles">;

type Props = {
  values: Collection[];
};

export function MoreInCollections({ values }: Props) {
  return values.map((value) => (
    <MoreReviews key={value.slug} values={value.titles}>
      <SubHeading as="h2">
        More{" "}
        <a className="text-accent" href={`/collections/${value.slug}`}>
          {value.name}
        </a>
      </SubHeading>
    </MoreReviews>
  ));
}
