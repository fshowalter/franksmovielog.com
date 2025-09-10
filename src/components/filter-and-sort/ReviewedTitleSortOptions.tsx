import { TitleSortOptions } from "./TitleSortOptions";

export function ReviewedTitleSortOptions(): React.JSX.Element {
  return (
    <>
      <TitleSortOptions />
      <option value="grade-desc">Grade (Best First)</option>
      <option value="grade-asc">Grade (Worst First)</option>
      <option value="review-date-desc">Review Date (Newest First)</option>
      <option value="review-date-asc">Review Date (Oldest First)</option>
    </>
  );
}
