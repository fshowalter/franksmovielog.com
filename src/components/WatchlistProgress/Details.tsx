import { BarGradient } from "src/components/BarGradient";
import { StatHeading } from "src/components/StatHeading";
import {
  Table,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableProgressRow,
} from "src/components/StatsTable";

import { ListItemCounts } from "../ListItemCounts";
import { SubHeading } from "../SubHeading";

type ValueType = "director" | "writer" | "performer" | "collection";

interface Value {
  name: string;
  reviewCount: number;
  titleCount: number;
  slug: string | null;
}

export function Details({
  label,
  valueType,
  values,
}: {
  label: string;
  valueType: ValueType;
  values: Value[];
}) {
  return (
    <section className="">
      <SubHeading as="h2" className="px-container">
        {label}
      </SubHeading>
      <div className="bg-default px-container pb-8">
        <Table>
          <TableHead>
            <tr className="col-span-3 grid grid-cols-subgrid">
              <TableHeaderCell align="left">Name</TableHeaderCell>
              <th>&nbsp;</th>
              <TableHeaderCell align="right">Progress</TableHeaderCell>
            </tr>
          </TableHead>
          <tbody className="col-span-3 row-start-2 grid grid-cols-subgrid">
            {values.map((value) => {
              return (
                <TableProgressRow key={value.name}>
                  <TableDataCell align="left">
                    <Name value={value} valueType={valueType} />
                  </TableDataCell>
                  <TableDataCell hideOnSmallScreens align="fill">
                    <BarGradient
                      value={value.reviewCount}
                      maxValue={value.titleCount}
                    />
                  </TableDataCell>
                  <TableDataCell
                    align="right"
                    className="col-start-3 self-center text-nowrap font-sans-narrow text-xs text-subtle tablet:text-sm"
                  >
                    {value.reviewCount} / {value.titleCount}
                  </TableDataCell>
                </TableProgressRow>
              );
            })}
          </tbody>
        </Table>
      </div>
    </section>
  );
}

function Name({ value, valueType }: { valueType: ValueType; value: Value }) {
  let linkTarget;

  if (valueType === "collection") {
    linkTarget = `/collections/${value.slug}`;
  } else {
    linkTarget = `/cast-and-crew/${value.slug}`;
  }

  if (value.slug)
    return (
      <a
        className="font-sans-book text-sm tracking-[-0.3px] text-accent"
        href={linkTarget}
      >
        {value.name}
      </a>
    );

  return (
    <span className="font-sans-book text-sm tracking-[-0.3px] text-subtle">
      {value.name}
    </span>
  );
}
