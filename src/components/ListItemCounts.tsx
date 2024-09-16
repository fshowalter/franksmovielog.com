export function ListItemCounts({
  current,
  total,
}: {
  current: number;
  total: number;
}): JSX.Element {
  return (
    <div className="ml-auto font-sans-narrow text-xs text-subtle tablet:text-sm">
      {current} / {total}
    </div>
  );
}
