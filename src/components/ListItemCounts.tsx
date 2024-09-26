export function ListItemCounts({
  current,
  total,
}: {
  current: number;
  total: number;
}): JSX.Element {
  return (
    <div className="ml-auto text-nowrap font-sans text-xs text-subtle">
      {current} / {total}
    </div>
  );
}
