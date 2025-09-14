import { gradeMap } from "./gradeMap";

export function fileForGrade(value: string): string {
  const [src] = gradeMap[value];

  return src;
}
