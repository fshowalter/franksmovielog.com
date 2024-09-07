export function ListInfo({
  visibleCount,
  totalCount,
}: {
  visibleCount: number;
  totalCount: number;
}): JSX.Element {
  let showingText;

  if (visibleCount > totalCount) {
    showingText = `Showing ${totalCount.toLocaleString()} of ${totalCount.toLocaleString()}`;
  } else {
    showingText = `Showing 1-${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`;
  }

  return (
    <div className="font-sans-caps sticky top-0 z-40 bg-default px-gutter text-center uppercase leading-10 tracking-[.6px] text-subtle desktop:top-0">
      {showingText}
    </div>
  );
}
