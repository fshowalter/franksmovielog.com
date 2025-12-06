export function ShowMoreButton({
  onShowMore,
}: {
  onShowMore?: () => void;
}): React.JSX.Element {
  return (
    <button
      className={`
        mx-auto w-full max-w-button transform-gpu cursor-pointer rounded-md
        bg-canvas py-5 text-center font-sans text-sm font-bold tracking-wide
        uppercase shadow-all transition-transform
        hover:scale-105 hover:drop-shadow-lg
      `}
      onClick={onShowMore}
      type="button"
    >
      Show More
    </button>
  );
}
