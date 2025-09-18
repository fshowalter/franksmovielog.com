const gradeMap: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  F: 1,
};

/**
 * Component that renders structured data for SEO and rich snippets.
 * @param props - Component props
 * @param props.directorNames - Array of director names
 * @param props.grade - Review grade letter
 * @param props.imdbId - IMDB identifier
 * @param props.releaseYear - Movie release year
 * @param props.seoImageSrc - SEO image source URL
 * @param props.title - Movie title
 * @returns Script element with JSON-LD structured data
 */
export function StructuredData({
  directorNames,
  grade,
  imdbId,
  releaseYear,
  seoImageSrc,
  title,
}: {
  directorNames: string[];
  grade: string;
  imdbId: string;
  releaseYear: string;
  seoImageSrc: string;
  title: string;
}): React.JSX.Element {
  const structuredData = {
    "@context": "http://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: "Frank Showalter",
    },
    itemReviewed: {
      "@type": "Movie",
      dateCreated: releaseYear,
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
