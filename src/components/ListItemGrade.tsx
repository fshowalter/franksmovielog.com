import { Grade } from "./Grade";

export function ListItemGrade({ grade }: { grade: string }) {
  return <Grade height={15} otherClasses="-mt-0.5 pb-[3px]" value={grade} />;
}
