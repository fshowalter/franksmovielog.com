import { TitleSortOptions } from "./TitleSortOptions";

/**
 * Component that renders sort options for reviewed title lists.
 * @returns Sort option elements including title and review-specific options
 */
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
