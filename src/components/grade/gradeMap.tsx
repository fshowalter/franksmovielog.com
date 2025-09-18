/**
 * Mapping of letter grades to star SVG files and accessibility labels.
 */
export const gradeMap: Record<string, [string, string]> = {
  A: ["/svg/5-stars.svg", "5 stars (out of 5)"],
  "A+": ["/svg/5-stars.svg", "5 stars (out of 5)"],
  "A-": ["/svg/4-half-stars.svg", "4.5 stars (out of 5)"],
  B: ["/svg/4-stars.svg", "4 stars (out of 5)"],
  "B+": ["/svg/4-stars.svg", "4 stars (out of 5)"],
  "B-": ["/svg/3-half-stars.svg", "3.5 stars (out of 5)"],
  C: ["/svg/3-stars.svg", "3 stars (out of 5)"],
  "C+": ["/svg/3-stars.svg", "3 stars (out of 5)"],
  "C-": ["/svg/2-half-stars.svg", "2.5 stars (out of 5)"],
  D: ["/svg/2-stars.svg", "2 stars (out of 5)"],
  "D+": ["/svg/2-stars.svg", "2 stars (out of 5)"],
  "D-": ["/svg/1-half-stars.svg", "1.5 stars (out of 5)"],
  F: ["/svg/1-star.svg", "1 star (out of 5)"],
  "F+": ["/svg/1-star.svg", "1 stars (out of 5)"],
  "F-": ["/svg/half-star.svg", "1/2 star (out of 5)"],
};
