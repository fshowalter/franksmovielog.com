export function StatHeading({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <h3 className="z-30 bg-canvas px-gutter py-2 text-md font-normal desktop:top-[var(--header-offset)]">
      {children}
    </h3>
  );
}
