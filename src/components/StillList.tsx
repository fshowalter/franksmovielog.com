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
    <ul className="flex w-full gap-x-[2.60416667%]">
      {values.map((value) => {
        return <StillListItem key={value.slug} value={value} />;
      })}
    </ul>
  );
}
