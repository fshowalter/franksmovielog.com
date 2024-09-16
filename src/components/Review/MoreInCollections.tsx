import type { Review } from "src/api/reviews";
import type { StillImageProps } from "src/api/stills";
import { MoreReviews } from "src/components/MoreReviews";
import { SubHeading } from "src/components/SubHeading";

type CollectionTitle = Review["moreCollections"][number]["titles"][number] & {
  stillImageProps: StillImageProps;
  excerpt: string;
};

type Collection = Omit<Review["moreCollections"][number], "titles"> & {
  titles: CollectionTitle[];
};

type Props = {
  values: Collection[];
};

export function MoreInCollections({ values }: Props) {
  return values.map((value) => (
    <MoreReviews key={value.slug} values={value.titles}>
      <SubHeading as="h2">
        More{" "}
        <a href={`/collections/${value.slug}`} className="text-accent">
          {value.name}
        </a>
      </SubHeading>
    </MoreReviews>
  ));
}
