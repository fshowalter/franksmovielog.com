export function ListInfo({
  visibleCount,
  totalCount,
}: {
  visibleCount: number;
  totalCount: number;
}): JSX.Element {
  let showingText;

  if (visibleCount > totalCount) {
    showingText = `Showing ${totalCount.toLocaleString()} of ${totalCount.toLocaleString()} viewings`;
  } else {
    showingText = `Showing 1-${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()} viewings`;
  }

  return (
    <div className="sticky top-0 z-40 bg-default font-sans-caps text-sm uppercase leading-10 tracking-[.6px] text-subtle shadow-bottom desktop:top-0">
      {showingText}
    </div>
  );
}
