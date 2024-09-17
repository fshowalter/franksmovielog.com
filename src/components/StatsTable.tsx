import React from "react";
import { ccn } from "src/utils/concatClassNames";

export function Table({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <table className="grid w-full border-collapse grid-cols-[1fr,0,auto] tablet:grid-cols-[auto,1fr,auto] tablet:whitespace-nowrap">
      {children}
    </table>
  );
}

export function TableHead({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <thead className="z-10 col-span-3 grid grid-cols-subgrid border-b-2 border-default bg-default text-base">
      {children}
    </thead>
  );
}

export function TableRow({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <tr className="col-span-3 grid grid-cols-subgrid border-b border-default leading-10">
      {children}
    </tr>
  );
}

export function TableProgressRow({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <tr className="col-span-3 grid grid-cols-subgrid border-b border-default leading-10">
      {children}
    </tr>
  );
}

export function TableHeaderCell({
  align,
  children,
}: {
  align: "left" | "right";
  children: React.ReactNode;
}): JSX.Element {
  if (align === "left") {
    return <th className="py-6 text-left font-normal">{children}</th>;
  }

  return <th className="py-6 text-right font-normal">{children}</th>;
}

export function TableDataCell({
  align,
  children,
  hideOnSmallScreens = false,
  className,
}: {
  hideOnSmallScreens?: boolean;
  align: "left" | "right" | "fill";
  className?: string;
  children: React.ReactNode;
}): JSX.Element {
  const hideOnSmallScreensClass = hideOnSmallScreens
    ? "max-tablet:w-0 max-tablet:*:hidden"
    : undefined;

  if (align === "fill") {
    return (
      <td
        className={ccn(
          "row-start-2 -mt-[3px] w-full p-0 tablet:row-start-auto tablet:mt-0 tablet:py-2",
          className,
        )}
      >
        {children}
      </td>
    );
  }

  if (align === "left") {
    return (
      <td
        className={ccn(
          "pr-4 text-left tablet:py-2",
          className,
          hideOnSmallScreensClass,
        )}
      >
        {children}
      </td>
    );
  }

  return (
    <td
      className={ccn(
        "block py-2 pl-4 text-right",
        className,
        hideOnSmallScreensClass,
      )}
    >
      {children}
    </td>
  );
}
