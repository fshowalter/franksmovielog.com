import { Grade } from "./Grade";

export function ListItemGrade({ grade }: { grade: string }) {
  return <Grade className="-mt-0.5" height={14} value={grade} />;
}
