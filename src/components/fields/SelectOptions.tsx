export function SelectOptions({
  options,
}: {
  options: readonly string[];
}): React.JSX.Element {
  return (
    <>
      <option key="all" value="All">
        All
      </option>
      {options.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </>
  );
}
