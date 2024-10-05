import type { Review } from "src/api/reviews";

interface Props
  extends Pick<
    Review,
    "title" | "imdbId" | "directorNames" | "year" | "grade"
  > {
  seoImageSrc: string;
}

const gradeMap: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  F: 1,
};

export function StructuredData({
  title,
  imdbId,
  directorNames,
  year,
  grade,
  seoImageSrc,
}: Props) {
  const structuredData = {
    "@context": "http://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Movie",
      name: title,
      sameAs: `http://www.imdb.com/title/${imdbId}/`,
      image: seoImageSrc,
      dateCreated: year,
      director: {
        "@type": "Person",
        name: directorNames[0],
      },
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: gradeMap[grade[0]],
    },
    author: {
      "@type": "Person",
      name: "Frank Showalter",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
