/**
 * Renders option elements for select fields with an "All" option.
 * @param props - Component props
 * @param props.options - Array of option values to render
 * @returns Option elements including "All" plus provided options
 */
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
