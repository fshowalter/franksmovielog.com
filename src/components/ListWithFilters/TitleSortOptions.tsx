export function TitleSortOptions({
  options,
}: {
  options: ("grade" | "release-date" | "review-date" | "title")[];
}): React.JSX.Element {
  return (
    <>
      {options.includes("title") && (
        <>
          <option value="title-asc">Title (A &rarr; Z)</option>
          <option value="title-desc">Title (Z &rarr; A)</option>
        </>
      )}
      {options.includes("grade") && (
        <>
          <option value="grade-desc">Grade (Best First)</option>
          <option value="grade-asc">Grade (Worst First)</option>
        </>
      )}
      {options.includes("release-date") && (
        <>
          <option value="release-date-desc">Release Date (Newest First)</option>
          <option value="release-date-asc">Release Date (Oldest First)</option>
        </>
      )}
      {options.includes("review-date") && (
        <>
          <option value="review-date-desc">Review Date (Newest First)</option>
          <option value="review-date-asc">Review Date (Oldest First)</option>
        </>
      )}
    </>
  );
}
