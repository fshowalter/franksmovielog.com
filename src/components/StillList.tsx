import type { StillListItemValue } from "./StillListItem";
import { StillListItem } from "./StillListItem";

export function StillList({
  values,
  seeAllLinkText,
  seeAllLinkTarget,
}: {
  values: StillListItemValue[];
  seeAllLinkText: string;
  seeAllLinkTarget: string;
}): JSX.Element {
  return (
    <ul className="flex w-full flex-col gap-x-[2.60416667%] gap-y-6 tablet:flex-row tablet:flex-wrap tablet:justify-between desktop:flex-nowrap">
      {values.map((value) => {
        return <StillListItem key={value.slug} value={value} />;
      })}
    </ul>
  );
}
