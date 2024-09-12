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
    <div className="sticky top-0 z-40 py-10 font-sans-bold text-xs font-bold uppercase tracking-[0.8px] text-subtle tablet:px-[1.5%] desktop:px-0">
      {showingText}
    </div>
  );
}
