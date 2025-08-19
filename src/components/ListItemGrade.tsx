import { Grade } from "./Grade";

export function ListItemGrade({ grade }: { grade: string }) {
  return <Grade className="-mt-[px]" height={16} value={grade} />;
}
