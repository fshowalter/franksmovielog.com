import { Button } from "./Button";

export function ShowMoreButton({
  onClick,
}: {
  onClick: () => void;
}): JSX.Element {
  return (
    <Button
      onClick={onClick}
      className="font-sans-narrow mx-auto w-full max-w-[430px] bg-default px-pageMargin py-5 text-center text-sm uppercase tracking-[.6px]"
    >
      Show More
    </Button>
  );
}
