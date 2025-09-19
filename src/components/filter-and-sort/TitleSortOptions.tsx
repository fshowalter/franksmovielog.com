/**
 * Component that renders sort options for title lists.
 * @returns Sort option elements for title sorting
 */
export function TitleSortOptions(): React.JSX.Element {
  return (
    <>
      <option value="title-asc">Title (A &rarr; Z)</option>
      <option value="title-desc">Title (Z &rarr; A)</option>
      <option value="release-date-desc">Release Date (Newest First)</option>
      <option value="release-date-asc">Release Date (Oldest First)</option>
    </>
  );
}
