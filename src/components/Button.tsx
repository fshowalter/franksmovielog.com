import { ccn } from "src/utils/concatClassNames";

export function Button({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={ccn(
        "mx-auto w-full max-w-[430px] bg-canvas px-pageMargin py-5 text-center font-sans-narrow text-sm uppercase tracking-[.6px] shadow-all hover:bg-inverse hover:text-inverse",
        className,
      )}
    >
      {children}
    </button>
  );
}
