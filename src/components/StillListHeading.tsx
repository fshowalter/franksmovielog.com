export function StillListHeading({
  leadText,
  linkText,
  linkTarget,
}: {
  leadText: string;
  linkText: string;
  linkTarget: string;
}) {
  return (
    <div className="w-full font-sans-bold text-[13px] uppercase tracking-[1px] text-[#252525] shadow-bottom tablet:py-4 tablet:shadow-none desktop:py-4">
      <span className="">{leadText}: </span>
      <a className="text-accent" href={linkTarget}>
        {linkText}
      </a>
      <div className="spacer-y-12" />
    </div>
  );
}
