export function SelectInput({
  children,
  defaultValue,
  onChange,
}: {
  children: React.ReactNode;
  defaultValue?: number | string | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}): React.JSX.Element {
  return (
    <select
      className={`
        w-full appearance-none border-none bg-default py-2 pr-8 pl-4 text-base
        leading-6 text-subtle shadow-all outline-accent
      `}
      defaultValue={defaultValue}
      key={defaultValue}
      onChange={onChange}
    >
      {children}
    </select>
  );
}
