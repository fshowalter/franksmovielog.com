import { graphql, Link } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
import toSentenceArray from "../../utils/to-sentence-array";
import DateIcon from "../DateIcon";
import Grade from "../Grade";
import Layout from "../Layout";
import RenderedMarkdown from "../RenderedMarkdown";
import Seo from "../Seo";
import WatchlistLinks from "../WatchlistLinks";
import RelatedMovies from "./RelatedMovies";
import {
  akaContainerCss,
  akaListCss,
  akaListItemCss,
  bodyCss,
  castCss,
  castLabelCss,
  containerCss,
  contentCss,
  creditsCss,
  dateCss,
  dateIconCss,
  directorsCss,
  gradeCss,
  headerCss,
  headerMetaCss,
  imageCss,
  olderViewingsCss,
  olderViewingsHeadingCss,
  olderViewingsListCss,
  posterCss,
  relatedCss,
  relatedHeaderCss,
  relatedHeadingCss,
  relatedMoreCss,
  relatedNameCss,
  reviewCss,
  reviewsListCss,
  reviewsListItemCss,
  separatorCss,
  slugCss,
  titleCss,
  viewingDateIconCss,
  watchlistCss,
} from "./ReviewPage.module.scss";

function buildStructuredData(pageData: PageQueryResult) {
  const gradeMap: { [index: string]: number } = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    F: 1,
  };

  return {
    "@context": "http://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "Movie",
      name: pageData.movie.title,
      sameAs: `http://www.imdb.com/title/${pageData.movie.imdbId}/`,
      image: pageData.movie.seoImage.childImageSharp.resize.src,
      dateCreated: pageData.movie.year,
      director: {
        "@type": "Person",
        name: pageData.movie.directorNames[0],
      },
    },
    reviewCount: pageData.movie.reviews.length,
    ratingValue: gradeMap[pageData.movie.lastReviewGrade[0]],
  };
}

function Related(pageData: PageQueryResult): JSX.Element | null {
  return (
    <div className={relatedCss}>
      {pageData.movie.watchlist.collections.map((collection) => (
        <RelatedMovies key={collection.name} movies={collection.browseMore}>
          <header className={relatedHeaderCss}>
            <h3 className={relatedHeadingCss}>
              More <span className={relatedNameCss}>{collection.name}</span>
            </h3>
            <Link
              to={`/watchlist/collections/${collection.slug}/`}
              className={relatedMoreCss}
            >
              See All &raquo;
            </Link>
          </header>
        </RelatedMovies>
      ))}
      {pageData.movie.watchlist.performers.map((performer) => (
        <RelatedMovies key={performer.slug} movies={performer.browseMore}>
          <header className={relatedHeaderCss}>
            <h3 className={relatedHeadingCss}>
              More with <span className={relatedNameCss}>{performer.name}</span>
            </h3>
            <Link
              to={`/watchlist/performers/${performer.slug}/`}
              className={relatedMoreCss}
            >
              See All &raquo;
            </Link>
          </header>
        </RelatedMovies>
      ))}
      {pageData.movie.watchlist.directors.map((director) => (
        <RelatedMovies key={director.slug} movies={director.browseMore}>
          <header className={relatedHeaderCss}>
            <h3 className={relatedHeadingCss}>
              More directed by{" "}
              <span className={relatedNameCss}>{director.name}</span>
            </h3>
            <Link
              to={`/watchlist/directors/${director.slug}/`}
              className={relatedMoreCss}
            >
              See All &raquo;
            </Link>
          </header>
        </RelatedMovies>
      ))}
      {pageData.movie.watchlist.writers.map((writer) => (
        <RelatedMovies key={writer.slug} movies={writer.browseMore}>
          <header className={relatedHeaderCss}>
            <h3 className={relatedHeadingCss}>
              More written by{" "}
              <span className={relatedNameCss}>{writer.name}</span>
            </h3>
            <Link
              to={`/watchlist/writers/${writer.slug}/`}
              className={relatedMoreCss}
            >
              See All &raquo;
            </Link>
          </header>
        </RelatedMovies>
      ))}
      <RelatedMovies movies={pageData.movie.browseMore}>
        <header className={relatedHeaderCss}>
          <h3 className={relatedHeadingCss}>
            More <span className={relatedNameCss}>Reviews</span>
          </h3>
          <Link to="/reviews/" className={relatedMoreCss}>
            See All &raquo;
          </Link>
        </header>
      </RelatedMovies>
    </div>
  );
}

/**
 * Renders a review page.
 */
export default function ReviewPage({
  data,
}: {
  data: PageQueryResult;
}): JSX.Element {
  const structuredData = buildStructuredData(data);
  const { movie } = data;

  return (
    <Layout>
      <Seo
        pageTitle={`${movie.title} (${movie.year})`}
        description={`A review of the ${movie.year} film ${movie.title}.`}
        image={movie.seoImage.childImageSharp.resize.src}
        article
      />
      <main className={containerCss}>
        {movie.backdrop && (
          <GatsbyImage
            className={imageCss}
            image={movie.backdrop.childImageSharp.gatsbyImageData}
            alt={`A still from ${movie.title} (${movie.year})`}
            loading="eager"
          />
        )}
        <header className={headerCss}>
          <h1 className={titleCss}>{movie.title}</h1>
          <div className={headerMetaCss}>
            {movie.year} <span className={separatorCss}>|</span>{" "}
            {movie.countries.reduce<JSX.Element | null>((acc, country) => {
              if (acc === null) {
                return <>{country}</>;
              }

              return (
                <>
                  {acc}
                  <span className={separatorCss}>&ndash;</span>
                  {country}
                </>
              );
            }, null)}{" "}
            <span className={separatorCss}>|</span> {movie.runtimeMinutes}
            &#x02009;min
          </div>
          {movie.akaTitles.length > 0 && (
            <div className={akaContainerCss}>
              aka:
              <ul className={akaListCss}>
                {movie.akaTitles.map((akaTitle) => (
                  <li key={akaTitle} className={akaListItemCss}>
                    {akaTitle}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>
        <aside className={creditsCss}>
          {movie.poster && (
            <GatsbyImage
              className={posterCss}
              image={movie.poster.childImageSharp.gatsbyImageData}
              alt={`A poster from ${movie.title} (${movie.year})`}
              loading="eager"
            />
          )}
          <div className={directorsCss}>
            <span className={castLabelCss}>Directed by</span>
            {toSentenceArray(movie.directorNames)}
          </div>
          <div className={castCss}>
            <span className={castLabelCss}>Starring</span>
            {toSentenceArray(movie.principalCastNames)}
          </div>
          <div className={watchlistCss}>
            <WatchlistLinks movie={movie} />
          </div>
        </aside>
        <ul className={reviewsListCss}>
          {movie.reviews.reverse().map((review) => (
            <li
              className={reviewsListItemCss}
              key={review.frontmatter.sequence}
            >
              <article className={reviewCss}>
                <header
                  className={slugCss}
                  id={review.frontmatter.sequence.toString()}
                >
                  <DateIcon className={dateIconCss} />{" "}
                  <span className={dateCss}>{review.frontmatter.date}</span> via{" "}
                  {review.frontmatter.venue}
                  {review.frontmatter.venueNotes && (
                    <> ({review.frontmatter.venueNotes})</>
                  )}
                </header>
                <div className={contentCss}>
                  <Grade
                    grade={review.frontmatter.grade}
                    className={gradeCss}
                  />
                  <RenderedMarkdown
                    className={bodyCss}
                    // eslint-disable-next-line react/no-danger
                    text={review.linkedHtml}
                  />
                </div>
              </article>
            </li>
          ))}
        </ul>
        {movie.olderViewings.length > 0 && (
          <div className={olderViewingsCss}>
            <h3 className={olderViewingsHeadingCss}>Older Viewings</h3>
            <ul className={olderViewingsListCss}>
              {movie.olderViewings.map((viewing) => (
                <li key={viewing.sequence}>
                  <div className={slugCss}>
                    <DateIcon className={viewingDateIconCss} />{" "}
                    <span className={dateCss}>{viewing.viewingDate}</span> via{" "}
                    {viewing.venue}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Related movie={movie} />
      </main>
      {structuredData && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Layout>
  );
}

interface PageQueryResult {
  movie: {
    imdbId: string;
    title: string;
    year: number;
    countries: string[];
    runtimeMinutes: number;
    lastReviewGrade: string;
    akaTitles: string[];
    principalCastNames: string[];
    directorNames: string[];
    browseMore: BrowseMoreMovie[];
    backdrop: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData;
      };
    };
    seoImage: {
      childImageSharp: {
        resize: {
          src: string;
        };
      };
    };
    poster: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData;
      };
    };
    reviews: {
      frontmatter: {
        grade: string;
        date: string;
        dateIso: string;
        venue: string;
        venueNotes: string;
        sequence: number;
      };
      linkedHtml: string;
    }[];
    olderViewings: {
      venue: string;
      viewingDate: string;
      sequence: number;
    }[];
    watchlist: {
      performers: WatchlistEntity[];
      directors: WatchlistEntity[];
      writers: WatchlistEntity[];
      collections: WatchlistEntity[];
    };
  };
}

interface BrowseMoreMovie {
  imdbId: string;
  title: string;
  lastReviewGrade: string;
  slug: string;
  year: number;
  backdrop: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
}

interface WatchlistEntity {
  name: string;
  slug: string;
  browseMore: BrowseMoreMovie[];
  avatar: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
}

export const pageQuery = graphql`
  query ($imdbId: String!) {
    movie: reviewedMoviesJson(imdb_id: { eq: $imdbId }) {
      imdbId: imdb_id
      title
      year
      countries
      runtimeMinutes: runtime_minutes
      lastReviewGrade
      akaTitles: aka_titles
      principalCastNames: principal_cast_names
      directorNames: director_names
      reviews {
        frontmatter {
          date(formatString: "ddd MMM D, YYYY")
          dateIso: date(formatString: "Y-MM-DD")
          grade
          sequence
          venue
          venueNotes: venue_notes
        }
        linkedHtml
      }
      browseMore {
        imdbId: imdb_id
        title
        lastReviewGrade
        slug
        year
        backdrop {
          childImageSharp {
            gatsbyImageData(
              layout: CONSTRAINED
              formats: [JPG, AVIF]
              quality: 80
              placeholder: TRACED_SVG
              width: 309
              breakpoints: [175, 195, 232, 309, 350, 390, 464, 618]
              sizes: "(max-width: 414px) 175px, (max-width: 1023px) 309px, (max-width: 1279px) 232px, 195px"
            )
          }
        }
      }
      olderViewings {
        viewingDate: viewing_date(formatString: "ddd MMM DD, YYYY")
        venue
        sequence
      }
      backdrop {
        childImageSharp {
          gatsbyImageData(
            layout: CONSTRAINED
            formats: [JPG, AVIF]
            quality: 80
            width: 1000
            placeholder: TRACED_SVG
            breakpoints: [414, 640, 818, 904, 1000, 1280, 1808, 2000]
            sizes: "(max-width: 414px) 414px, (max-width: 1023px) 640px, (max-width: 1279px) 1000px, 904px"
          )
        }
      }
      seoImage: backdrop {
        childImageSharp {
          resize(toFormat: JPG, width: 1200, quality: 80) {
            src
          }
        }
      }
      poster {
        childImageSharp {
          gatsbyImageData(
            layout: CONSTRAINED
            formats: [JPG, AVIF]
            quality: 80
            width: 250
            placeholder: TRACED_SVG
            breakpoints: [93, 141, 160, 186, 250, 282, 320, 500]
            sizes: "(max-width: 414px) 93px, (max-width: 767px) 141px, (max-width: 1023px) 160px, 250px"
          )
        }
      }
      watchlist {
        performers {
          name
          slug
          avatar {
            childImageSharp {
              gatsbyImageData(
                layout: FIXED
                formats: [JPG, AVIF]
                quality: 80
                width: 40
                height: 40
                placeholder: TRACED_SVG
              )
            }
          }
          browseMore(movieImdbId: $imdbId) {
            imdbId: imdb_id
            title
            lastReviewGrade
            slug
            year
            backdrop {
              childImageSharp {
                gatsbyImageData(
                  layout: CONSTRAINED
                  formats: [JPG, AVIF]
                  quality: 80
                  placeholder: TRACED_SVG
                  width: 309
                  breakpoints: [175, 195, 232, 309, 350, 390, 464, 618]
                  sizes: "(max-width: 414px) 175px, (max-width: 1023px) 309px, (max-width: 1279px) 232px, 195px"
                )
              }
            }
          }
        }
        directors {
          name
          slug
          avatar {
            childImageSharp {
              gatsbyImageData(
                layout: FIXED
                formats: [JPG, AVIF]
                quality: 80
                width: 40
                height: 40
                placeholder: TRACED_SVG
              )
            }
          }
          browseMore(movieImdbId: $imdbId) {
            imdbId: imdb_id
            title
            lastReviewGrade
            slug
            year
            backdrop {
              childImageSharp {
                gatsbyImageData(
                  layout: CONSTRAINED
                  formats: [JPG, AVIF]
                  quality: 80
                  placeholder: TRACED_SVG
                  width: 309
                  breakpoints: [175, 195, 232, 309, 350, 390, 464, 618]
                  sizes: "(max-width: 414px) 175px, (max-width: 1023px) 309px, (max-width: 1279px) 232px, 195px"
                )
              }
            }
          }
        }
        writers {
          name
          slug
          avatar {
            childImageSharp {
              gatsbyImageData(
                layout: FIXED
                formats: [JPG, AVIF]
                quality: 80
                width: 40
                height: 40
                placeholder: TRACED_SVG
              )
            }
          }
          browseMore(movieImdbId: $imdbId) {
            imdbId: imdb_id
            title
            lastReviewGrade
            slug
            year
            backdrop {
              childImageSharp {
                gatsbyImageData(
                  layout: CONSTRAINED
                  formats: [JPG, AVIF]
                  quality: 80
                  placeholder: TRACED_SVG
                  width: 309
                  breakpoints: [175, 195, 232, 309, 350, 390, 464, 618]
                  sizes: "(max-width: 414px) 175px, (max-width: 1023px) 309px, (max-width: 1279px) 232px, 195px"
                )
              }
            }
          }
        }
        collections {
          name
          slug
          avatar {
            childImageSharp {
              gatsbyImageData(
                layout: FIXED
                formats: [JPG, AVIF]
                quality: 80
                width: 40
                height: 40
                placeholder: TRACED_SVG
              )
            }
          }
          browseMore(movieImdbId: $imdbId) {
            imdbId: imdb_id
            title
            lastReviewGrade
            slug
            year
            backdrop {
              childImageSharp {
                gatsbyImageData(
                  layout: CONSTRAINED
                  formats: [JPG, AVIF]
                  quality: 80
                  placeholder: TRACED_SVG
                  width: 309
                  breakpoints: [175, 195, 232, 309, 350, 390, 464, 618]
                  sizes: "(max-width: 414px) 175px, (max-width: 1023px) 309px, (max-width: 1279px) 232px, 195px"
                )
              }
            }
          }
        }
      }
    }
  }
`;
