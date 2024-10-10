import type { Review } from "src/api/reviews";

interface Props
  extends Pick<
    Review,
    "directorNames" | "grade" | "imdbId" | "title" | "year"
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
  directorNames,
  grade,
  imdbId,
  seoImageSrc,
  title,
  year,
}: Props) {
  const structuredData = {
    "@context": "http://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: "Frank Showalter",
    },
    itemReviewed: {
      "@type": "Movie",
      dateCreated: year,
      director: {
        "@type": "Person",
        name: directorNames[0],
      },
      image: seoImageSrc,
      name: title,
      sameAs: `http://www.imdb.com/title/${imdbId}/`,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: gradeMap[grade[0]],
    },
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      type="application/ld+json"
    />
  );
}
