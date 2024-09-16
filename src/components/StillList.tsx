import type { StillListItemValue } from "./MoreReviewsCard";
import { StillListItem } from "./MoreReviewsCard";

export function StillList({
  values,
  children,
}: {
  values: StillListItemValue[];
  children: React.ReactNode;
}): JSX.Element {
  return (
    <nav className="relative mx-auto flex w-full max-w-screen-max flex-col items-center px-container-base desktop:px-20">
      {children}
      <ul className="flex w-full flex-col gap-x-[2.60416667%] gap-y-6 tablet:flex-row tablet:flex-wrap tablet:justify-between desktop:flex-nowrap">
        {values.map((value) => {
          return <StillListItem key={value.slug} value={value} />;
        })}
      </ul>
    </nav>
  );
}
