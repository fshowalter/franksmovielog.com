import { ccn } from "src/utils/concatClassNames";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={ccn("flex flex-col", className)}>
      <div
        className="whitespace-nowrap font-normal leading-8"
        style={{ fontSize: "1.5625rem" }}
      >
        <a href="/">Frank&apos;s Movie Log</a>
      </div>
      <p className={"w-full pl-px text-sm italic leading-4 opacity-85"}>
        My life at the movies.
      </p>
    </div>
  );
}
