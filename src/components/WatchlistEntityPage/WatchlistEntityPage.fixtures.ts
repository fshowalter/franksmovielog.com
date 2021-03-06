import { Layout } from "gatsby-plugin-image";

export default {
  entity: {
    name: "John Carpenter",
    avatar: {
      childImageSharp: {
        gatsbyImageData: {
          layout: "fixed" as Layout,
          placeholder: {
            fallback:
              "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='174'%20height='174'%20viewBox='0%200%20174%20174'%20preserveAspectRatio='none'%3e%3cpath%20d='M61%201l-1%203c0%202%200%202%202%202l5%201%203%202h-3l-3%202-1%202h-2c0-1-8%208-10%2012l-3%205c-4%200-8%207-8%2013l-2%206-1%205-2%202-1%204v2c-1%201-4%2015-4%2022l2%208%201%207c1%202%205%2010%207%2010l5%206%2012%2010-1-5-2-8c-1-4-1-4-3-3-2%200-3%200-4-2-2-3-1-7%201-7%201-1%202-2%202-7%201-7-1-26-2-27l-1-1h1l1-3c0-5%204-10%208-10%201%200%206-3%204-3l2-2c1-1%203-2%204-1%202%201%203%200%204-1h3l1-1%201-1%203%202c1%203%204%201%205-3%201-3%203-4%205-1l5%202c2-1%204%201%204%204%200%202%202%203%205%204l4%203%203%201c3%201%204%206%206%2022l2%2013c1%204%200%2011-3%2011l-2%202-2%201c-2%200-4%203-3%207%200%206-2%205-10-5-2-2-2-2-2%200s-1%202-3%202c-3%200-9%203-9%204l-1%204-1%201c0-2-3%201-3%203h3c0%203%205-2%204-5%200-2%200-2%202-2%203%200%205%202%204%204h-1c-1-1-1-1-1%201%200%204-3%205-8%205h-3l7%202c7%200%208%202%201%203l-3%202%202%201c0%201%201%202%203%202l5%202%202%201-4%204-8%204c-5%200-6%202-1%204l8%203%205%202%202%202-1%201c-2%200-1%202%202%202l2%201-2%202c-2%203-3%204%200%204%202%200%206-4%206-7%201-3%204-3%204%201%202%206-2%208-14%208-18%200-32-4-38-8l-4-3-5%202-5%202-3%201c-1%202-11%205-22%207-6%202-13%204-13%206h169v-10c0-12%201-10-14-12a213%20213%200%2001-30-5c-4-1-5-1-5%201s-6%209-7%209l-1-8-1-8v-9c0-3%200-4-1-3v-5l1-5%201%204%201%205%203-2c4-2%2010-10%2010-15l3-6c4-5%206-12%206-18l-3-14-4-18-2-9c-2-5%200-3%2011%208s20%2022%2027%2034c5%208%207%209%202%200a192%20192%200%2000-42-49h7v3l9%209c8%208%2018%2020%2025%2031l4%207V0h-15v8c-1%202-3%200-3-4V0h-5c-4%200-5%201-7%202l-2%202V2c-1-2-2-2-29-2-25%200-27%200-26%202h-1c-2-1-4%200-6%203-1%201-1%202-2%201l2-3%201-3-4%204-3%202%202-3c2-2%201-3-7-3l-8%201m42%2076l-6%201-7%203c-5%202-4%207%202%2011%203%201%204%200%202-2l1-3c3-2%203-2%205-1%202%202%205%202%205%200h3c4%202%206%200%206-5%200-3-6-5-11-4'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
          },
          images: {
            fallback: {
              src: "/static/3d015f5d5715c33ec988fb67831919f9/448fd/john-carpenter.jpg",
              srcSet:
                "/static/3d015f5d5715c33ec988fb67831919f9/448fd/john-carpenter.jpg 200w,\n/static/3d015f5d5715c33ec988fb67831919f9/382f3/john-carpenter.jpg 400w",
              sizes: "200px",
            },
            sources: [
              {
                srcSet:
                  "/static/3d015f5d5715c33ec988fb67831919f9/c7382/john-carpenter.avif 200w,\n/static/3d015f5d5715c33ec988fb67831919f9/20a4d/john-carpenter.avif 400w",
                type: "image/avif",
                sizes: "200px",
              },
            ],
          },
          width: 200,
          height: 200,
        },
      },
    },
    watchlistMovies: [
      {
        imdbId: "tt0069945",
        title: "Dark Star",
        year: 1974,
        lastReviewGrade: "C+",
        reviewedMovieSlug: "dark-star-1974",
        sortTitle: "Dark Star (1974)",
        releaseDate: "1974-04-01",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M0%2044a726%20726%200%20000%2056l1%204%207-11c8-11%209-13%209-9l1%206c0%202-1%204-9%2015l-9%2013v63h27l-5-2-7-3c-3%200-3-3%200-7l2-2v-1l1-2%204-4c2-3%204-4%207-1l2%201-4-7c-2-1-2-1%200%200%206%201%2040%2014%2040%2015-1%202%202%205%208%207l7%204-2%201%2050%201h49v-3c0-4%202-6%203-2%202%204%202%204%208-1%206-3%207-3%202%201l-3%204%2041%201h41l1-3%203-5%203-5c0-3%201-4%202-1h4l7%201c2%202%202%202-5%202-8-1-8-1-5%203l3%201-3%201c-2%200-5%203-4%204l3-1%204-1c2%200%202%201-1%202l-4%202h43V0h-44v3l-1%202-1-3c0-2-1-2-5-2-5%200-5%200-5%202%201%201%200%202-1%202v8c-1%201-3-2-4-7V0h-5c-6%200-6%201-1%202%203%201%203%201-1%201h-4l-2%201c-1%200%200%202%203%205s4%204%204%2010v8c2%203%204%2013%202%2013l-2-3-2-3c-1%200-4-6-4-11l-2-8-3-9-1-6h-33l-33%201c0%203-7%204-8%201%200-3-2-3-2%200-1%203-29%203-29%200l-1-2-1%202-3%201-4-1c0-2-1-2-4-2-5%200-5%200-5%204v3h-9c-10%200-10-2%201-5%203%200%205-1%205-2H99v4c1%203%200%203-3%203s-3%200-3-3l1-4h-6c-5%200-6%200-7%203l-1%203V3c1-4-2-4-3%201l-1%204V4c1-4%201-4-2-4-4%200-4%200-5%207-2%206-6%2013-5%207l2-9%201-5H38l-2%2014-2%2018c-1%205%200%208%201%205v-2h6c3%201%203%201%202%204l-1%204-2%203c-1%202-1%202-1-1%201-2%200-3-2-4-3-1-3-1-5%208l-1%206%201-1%203-5%203-2v4c1-1%201-1%201%201l-1%202-2%202-3%205c-2%203-2%203-3%201l-1%205-7%2032c-2%204%201-25%205-44l2-15a574%20574%200%20017-40l-2%202c0%202-1%204-4%205l-4%205c-1%202-1%202-1%200%200-3%201-4%204-6%203-1%204-3%204-4%200-2-1-2-17-2H0v44M241%206l-7%202h-7c-2-2-2-2-4%200s-2%202-1%203c3%202%205%202%2013%200l6-1%201%207%202%2010%203%209%201%206c1%200%201-5-2-16a214%20214%200%2001-4-18V7c0-2%200-2-1-1M123%208l-18%202c-5%201%200%202%209%202l10%201%202%2023%201%2022-2%202c-2%202-2%202-1%203l4%203%207%204h20l5-3c5-2%207-1%207%202%200%202%201%202%202-1%203-4%205-3%203%201v4c1%203%204%201%204-3-1-2%200-3%202%200h1v6l2-3%203-5c-1-1%200-2%201-3%202-2%205-7%203-7l-4%204-3%204v-3l1-3%202-1%204-2c2-1%202-1%201-2s-2%200-4%202-3%202-3%201c-1-3%204-7%208-8%202%200%202-1%201-1-2%200-2%200%200-2%203-4-2-1-9%205-2%202-3%202-4%200-1-1-1-1-4%202-6%207-4%207-24%206h-19V43l-2-24v-6h27l27-1%202-3c2%200%202%200%201-1h-63m57%2010l-8%201h-7v6h7l6%201-6%201c-7%200-7%200-7%203%200%202%200%202%209%202%208%200%2010%200%2010%202h6v-5c2-1%200-10-2-11l-3%202-1%202-1%203-1%202v-5c0-6%200-8-2-4m-39%204c0%204%200%204%2012%203h10v-6h-22v3m-22%209c-1%204-2%205-5%205-5%200-5%204%201%209%204%204%205%205%204%206l1%204c1%203%203%205%204%204l-1-2v-1c1%200%201-18-1-26l-1-3-2%204m22-1v3h22v-6h-22v3m134%2010c1%208%201%207%209%2016l4%205%201%202c2%200%201-4%200-7-2-2-2-5-1-5%203%200%201-5-4-10-4-4-5-5-5-3l-1-1-2-4-1%207m-134-5c-1%204%200%205%2011%205%2010%200%2011-1%2011-3s-1-3-11-3l-11%201M19%2039c-3%204-5%208-2%208%201-1%202%201%200%202s-3%205-2%206c1%200%200%202-2%203-2%203-3%205-1%205l1%203c1%207%205%200%207-10%200-4%200-4-1-3h-2l1-2c2-1%203-6%202-6v-3l2-4c0-1-1-1-3%201m123%206v2h10c10%200%2011-1%2011-3s0-2-10-2h-11v3m102-2v9c1%2010%203%2014%206%2017%205%203%206%2012%204%2019-2%206-2%206%200%209%202%204%202%204%205-4%202-8%202-8%200-11-3-4-3-6%201-5h13l-8-4-9-2v-8l-1-7c-1%200-3%202-3%205-1%201-1%201-1-1l-2-2c-2%200-3-3-1-4v-2l-1-5c0-5-1-6-3-4m32%209l1%207c0%204%201%206%205%2011l5%206v-4l1-3%201%203%201%204v-5l-2-6-2-2-4-6c-4-6-7-8-6-5M64%2075c-2%205-2%205%200%206%203%203%200%204-5%202-7-3-6-3-9%202s-3%205-2%200v-6l-1%202c0%202-8%2018-19%2036l-10%2019%204-5c17-28%2018-29%2021-28l9%202c8%200%2011%201%2011%204-1%203%200%202%202-1%201-4%202-4-10-9-11-4-12-4-10-6%200-2%202-1%2011%203l11%204c1%200%209-16%209-19s0-3-2-4c-5-2-6-3-6-5%200-4-2-3-4%203m51%204c0%203%202%208%206%2012l4%209a832%20832%200%20006%2018c3%205%204%206%204%204l-1-3c-2-1-5-14-4-16l-4-10-5-10c0-5-5-8-6-4m131%2017l-7%203c-3%200-20%207-20%208%201%200-1%202-3%202l-6%204c0%202-2%203-3%203-2%200-2%200-1-1s1-1-1-1l-2%201-3%201c-5%201-9%204-9%206l1%201c2%200%201%202-1%204l-2%202h4l-5%203c-2%200-2%202-1%2014%201%207%202%208%203%208l3-2%202-2v-1c-2-1-2-1%200-2l5-1c1%201%205-2%205-5%200-2%202-4%202-2l2%201c2%200%201-2-1-4s-1-3%206-7l7-8%207-7c4-3%205-5%204-6-1-5%2012-6%2020-3%205%203%206%202%202-4-3-5-5-7-8-5m-128%204c0%201-1%202-3%202-4%201-4%201%202%208%206%206%206%209%203%2014-2%202-3%203-2%205l2%202%204-2c3-1%203-2%203-5%200-4-4-16-5-18l-2-3-1-4-1%201m-16%204v4l1%203-2-3c-2-2-3-2-4-1s0%202%203%205c5%204%207%208%202%204-3-2-4-2-2%201l2%202v2c2%202%202%206%200%2010l-1%205c1%200%206-3%206-5l4%201c4%202%205%202%202-3l-3-4c0-6-2-13-3-15-4-4-1-3%203%201l6%204-4-5-6-6h-4m179%205l-1%203c-1%201-1%202%201%206l2%209%203%205v-2c0-5%200-5%2011-1%2013%204%2014%204%2013%202l-18-8c-6-1-8-4-8-8l-2-8-1%202'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/610006b9d4183de78aac0197b73f3fd8/467f6/dark-star-1974.jpg",
                  srcSet:
                    "/static/610006b9d4183de78aac0197b73f3fd8/9225b/dark-star-1974.jpg 151w,\n/static/610006b9d4183de78aac0197b73f3fd8/4f425/dark-star-1974.jpg 184w,\n/static/610006b9d4183de78aac0197b73f3fd8/58a2e/dark-star-1974.jpg 238w,\n/static/610006b9d4183de78aac0197b73f3fd8/2502d/dark-star-1974.jpg 302w,\n/static/610006b9d4183de78aac0197b73f3fd8/467f6/dark-star-1974.jpg 321w,\n/static/610006b9d4183de78aac0197b73f3fd8/29154/dark-star-1974.jpg 368w,\n/static/610006b9d4183de78aac0197b73f3fd8/019d5/dark-star-1974.jpg 476w,\n/static/610006b9d4183de78aac0197b73f3fd8/82a3f/dark-star-1974.jpg 642w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/610006b9d4183de78aac0197b73f3fd8/3549e/dark-star-1974.avif 151w,\n/static/610006b9d4183de78aac0197b73f3fd8/eb4a3/dark-star-1974.avif 184w,\n/static/610006b9d4183de78aac0197b73f3fd8/2b27f/dark-star-1974.avif 238w,\n/static/610006b9d4183de78aac0197b73f3fd8/22006/dark-star-1974.avif 302w,\n/static/610006b9d4183de78aac0197b73f3fd8/42906/dark-star-1974.avif 321w,\n/static/610006b9d4183de78aac0197b73f3fd8/e5c3e/dark-star-1974.avif 368w,\n/static/610006b9d4183de78aac0197b73f3fd8/d7443/dark-star-1974.avif 476w,\n/static/610006b9d4183de78aac0197b73f3fd8/5bf7b/dark-star-1974.avif 642w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0074156",
        title: "Assault on Precinct 13",
        year: 1976,
        lastReviewGrade: "A-",
        reviewedMovieSlug: "assault-on-precinct-13-1976",
        sortTitle: "Assault on Precinct 13 (1976)",
        releaseDate: "1976-10-08",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M0%2067a479%20479%200%20002%2081c2%209%203%209%2013%209%2014%200%2023%202%2023%205%200%205-8%205-22%200-12-4-16-5-16-2%200%202%206%204%2015%206l4%201h-3c-3%201-5%201-12-2-3-1%201%203%206%206%205%204%206%205%203%205-5-1-13%201-13%203s3%203%209%201h4l49%201h48l-1-5%201-5%202%206v4h48c46%200%2047%200%2046-2-2-3-1-3%204-1%205%203%209%204%209%201l-1-3c-2-1%200-3%202-3v-1c-2-2-2-2%201-5%202-3%203-5%202-6s2-4%203-4l2-2c0-2%200-2-1-1-3%202-4-1-2-4v-3h-1c0%202%200%202-2%202l-2-1%201-1-2-2-1-5c0-4%200-4-2-2l-2%204c-1%201-1%200-1-2%200-8%205-27%208-31%204-5%2012-9%2018-11%204%200%204%200%205%203l3%203c2-1%200%202-3%206l-1-1c-1-1-1-1-1%201%201%204%200%206-2%203-1-2-3-2-3%201s3%207%205%206l1%201-2%201c-2%200-3%204%200%205%201%201%201%201-1%204l-2%203-6%2013%201%201v1c0%202%201%203%203%201v-2c-2-1-2-2%202-4l4-3h2c2%200%202%200%202-4l11-11%204-2h4c2%201%204%200%204-3-1-3%201-5%206-5%203%200%204%200%208-6%202-4%205-7%206-7v-1h-3l-1%201h-2c-3%201-2-4%201-7l2-3%202%201%2016%2010c9%205%2017%2014%2017%2018h-1c-2-2-3-1-2%203l-1%205h-1l-1-1-3-1-1-3c-1-2-1-2-1%203s0%206-2%206l-1-7c1-8-1-7-4%203-1%205-5%2012-5%209l2-5v-4l1-1c2-3%201-6-1-5l-2-1c2-5%202-5-1-2-4%204-8%2019-6%2019v1c-4%201-6%200-6-2v-1l-7%208%205-12%202-4c0-2-4%202-6%206l-6%208c-4%205-5%207-4%208v6c-1%203-1%204-4%204l-3%201-5%201c-2%200-3%200-2%201l-2%201c-2%200-3%201-3%202h-1c0-1-1-1-3%201-3%202-4%204-1%202%204-2%204%200%201%203-4%203-5%205-2%204v1c-1%203%202%202%205%200l3-4%202-1c2-1%201%203-2%205l-1%201%2035%201h36V0H0v67m262-41c2%202%202%202%200%202l-1%202h4c1-1%202-1%202%201h4c1-2%205-1%206%201l2%202h2c1%201%208%201%208-1l-8-4c-6-3-8-4-14-4s-6%200-5%201m-160%208c-2%202-2%208-1%209l1%202c-1%200-2%202-2%208l-1%203-1%202c-1%202%203%208%206%208v3l1%202%202%201%202%203c1%202%202%202%204%200l5-1c2%200%202%200%202-3s-1-3-3-3l-2-1%204-1c7%200%207-1%202-8l-4-9c1-2-1-13-3-15-1-1-12-2-12%200m162%2010v1l-2%202-2%202%202%201c2%200%203%201%203%202%201%202-2%204-4%203l-3-1c-2%200-1%202%204%204%208%204%209%209%203%207-3%200-3%200-2%202l1%203%203%201c1%201%202%202%205%201l4-1v-2l1-3c2%200%200-4-2-6-4-2-4-4-2-8v-4c-1%200-1-1%201-1v-3h-10M58%2085v4l-2-1h-3l-5%201-10%205-10%206c-3%200-5%202-6%203%200%202-1%202-1%201h-3l1%201-1%202c-3%203-2%202%204%200%205-3%2014-3%2018-1%202%201%202%201-3%201-8%200-8%200-14%203-5%202-11%207-11%208l-2%204-2%203h2c2-1%203-1%203%201l-3%202-2%201h12c0%202-1%202-3%201-1-1-2-1-4%201l-4%202-3%202c-1%202%201%202%203%201l2-1h1c2-3%209-2%2010%201%200%203%202%202%203-1l1-3%203%203%202%205c0%201%201%201%201-1h2l1%201c2-1%201%201-1%203-2%204%200%209%205%2014l4%204%204-4%207-5%203-1%201-3-1-1-1%201v-4c-1-3%200-5%201-3s2%202%203%201%202%200%206%203l3%202c1%201%200%201-1%201-5%200-4%202%200%202h5l-5%201-4%202%202%205%201%203c0-4%205-3%205%200l3%203%203%202h-3l-5-2c-4-3-4-1-1%202%203%202%207%203%2011%201v-1l-2-1-1-4c0-2%200-3%201-2l2%202%201%202%201-1%201-2c1%200%202%201%202%203%200%203%200%203%203%203%205%200%207-1%207-2h-1v-4c2-5%203-18%201-19l-1-6-2-7-5-7-4-6%204-5%204-6c1%200%201-1-2-6v-4l-3-5c-4-3-5-4-4-2%200%202-4%202-6%201v2c3%203%200%202-5-1l-5-3-3-1h-5m36%2011l1%203c2%202%202%203-1%204l-1%202%201%202c-1%201%200%202%201%203l1%201h-1c-2-2-5-1-3%200%202%202%200%205-2%203l1%203c1%202%201%202%203%200%201-1%201-1%201%203s0%204%201-1c0-5%201-6%202-6l1-1c-1-1%200-3%202-4l1-3c-5-8-8-12-8-9m-80%2039c-1%201-1%201%201%201s2%200%202%202l-1%202-1%201-1-1c1-2-1-3-2-2l-4%201c-1-1-2%200-3%201s-2%201-2-2c-1-2-1-1-1%203%200%207%204%2013%208%2014%202%200%202%200%200-1-2%200-7-8-6-10%201-1%205%201%205%203%200%203%201%203%204%202%202-1%203-1%205%201%204%203%204%203%203-1%200-3-1-3-3-2h-2l2-2c2-2%203-3%201-3-1%200-2-1-1-2l1%201h2l-2-4c-3-3-3-3-5-2'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/9b0b083ca27d9f2fd08697348e679ec7/467f6/assault-on-precinct-13-1976.jpg",
                  srcSet:
                    "/static/9b0b083ca27d9f2fd08697348e679ec7/9225b/assault-on-precinct-13-1976.jpg 151w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/4f425/assault-on-precinct-13-1976.jpg 184w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/58a2e/assault-on-precinct-13-1976.jpg 238w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/2502d/assault-on-precinct-13-1976.jpg 302w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/467f6/assault-on-precinct-13-1976.jpg 321w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/29154/assault-on-precinct-13-1976.jpg 368w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/019d5/assault-on-precinct-13-1976.jpg 476w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/82a3f/assault-on-precinct-13-1976.jpg 642w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/9b0b083ca27d9f2fd08697348e679ec7/3549e/assault-on-precinct-13-1976.avif 151w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/eb4a3/assault-on-precinct-13-1976.avif 184w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/2b27f/assault-on-precinct-13-1976.avif 238w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/22006/assault-on-precinct-13-1976.avif 302w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/42906/assault-on-precinct-13-1976.avif 321w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/e5c3e/assault-on-precinct-13-1976.avif 368w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/d7443/assault-on-precinct-13-1976.avif 476w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/5bf7b/assault-on-precinct-13-1976.avif 642w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0077651",
        title: "Halloween",
        year: 1978,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Halloween (1978)",
        releaseDate: "1978-10-25",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0080749",
        title: "The Fog",
        year: 1980,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Fog (1980)",
        releaseDate: "1980-01-01",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0082340",
        title: "Escape from New York",
        year: 1981,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Escape from New York (1981)",
        releaseDate: "1981-04-01",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0084787",
        title: "The Thing",
        year: 1982,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Thing (1982)",
        releaseDate: "1982-06-25",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0085333",
        title: "Christine",
        year: 1983,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Christine (1983)",
        releaseDate: "1983-12-09",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0088172",
        title: "Starman",
        year: 1984,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Starman (1984)",
        releaseDate: "1984-12-14",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0090728",
        title: "Big Trouble in Little China",
        year: 1986,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Big Trouble in Little China (1986)",
        releaseDate: "1986-07-02",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0093777",
        title: "Prince of Darkness",
        year: 1987,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Prince of Darkness (1987)",
        releaseDate: "1987-10-21",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0096256",
        title: "They Live",
        year: 1988,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "They Live (1988)",
        releaseDate: "1988-11-04",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0104850",
        title: "Memoirs of an Invisible Man",
        year: 1992,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Memoirs of an Invisible Man (1992)",
        releaseDate: "1992-02-28",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0113409",
        title: "In the Mouth of Madness",
        year: 1995,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "In the Mouth of Madness (1994)",
        releaseDate: "1994-12-10",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0114852",
        title: "Village of the Damned",
        year: 1995,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Village of the Damned (1995)",
        releaseDate: "1995-04-28",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0116225",
        title: "Escape from L.A.",
        year: 1996,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Escape from L.A. (1996)",
        releaseDate: "1996-08-09",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0120877",
        title: "Vampires",
        year: 1998,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Vampires (1998)",
        releaseDate: "1998-04-15",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0228333",
        title: "Ghosts of Mars",
        year: 2001,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Ghosts of Mars (2001)",
        releaseDate: "2001-08-24",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt1369706",
        title: "The Ward",
        year: 2010,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Ward (2010)",
        releaseDate: "2010-09-13",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
    ],
  },
};

export const dataNoAvatar = {
  entity: {
    name: "John Carpenter",
    avatar: null,
    watchlistMovies: [
      {
        imdbId: "tt0069945",
        title: "Dark Star",
        year: 1974,
        lastReviewGrade: "C+",
        reviewedMovieSlug: "dark-star-1974",
        sortTitle: "Dark Star (1974)",
        releaseDate: "1974-04-01",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M0%2044a726%20726%200%20000%2056l1%204%207-11c8-11%209-13%209-9l1%206c0%202-1%204-9%2015l-9%2013v63h27l-5-2-7-3c-3%200-3-3%200-7l2-2v-1l1-2%204-4c2-3%204-4%207-1l2%201-4-7c-2-1-2-1%200%200%206%201%2040%2014%2040%2015-1%202%202%205%208%207l7%204-2%201%2050%201h49v-3c0-4%202-6%203-2%202%204%202%204%208-1%206-3%207-3%202%201l-3%204%2041%201h41l1-3%203-5%203-5c0-3%201-4%202-1h4l7%201c2%202%202%202-5%202-8-1-8-1-5%203l3%201-3%201c-2%200-5%203-4%204l3-1%204-1c2%200%202%201-1%202l-4%202h43V0h-44v3l-1%202-1-3c0-2-1-2-5-2-5%200-5%200-5%202%201%201%200%202-1%202v8c-1%201-3-2-4-7V0h-5c-6%200-6%201-1%202%203%201%203%201-1%201h-4l-2%201c-1%200%200%202%203%205s4%204%204%2010v8c2%203%204%2013%202%2013l-2-3-2-3c-1%200-4-6-4-11l-2-8-3-9-1-6h-33l-33%201c0%203-7%204-8%201%200-3-2-3-2%200-1%203-29%203-29%200l-1-2-1%202-3%201-4-1c0-2-1-2-4-2-5%200-5%200-5%204v3h-9c-10%200-10-2%201-5%203%200%205-1%205-2H99v4c1%203%200%203-3%203s-3%200-3-3l1-4h-6c-5%200-6%200-7%203l-1%203V3c1-4-2-4-3%201l-1%204V4c1-4%201-4-2-4-4%200-4%200-5%207-2%206-6%2013-5%207l2-9%201-5H38l-2%2014-2%2018c-1%205%200%208%201%205v-2h6c3%201%203%201%202%204l-1%204-2%203c-1%202-1%202-1-1%201-2%200-3-2-4-3-1-3-1-5%208l-1%206%201-1%203-5%203-2v4c1-1%201-1%201%201l-1%202-2%202-3%205c-2%203-2%203-3%201l-1%205-7%2032c-2%204%201-25%205-44l2-15a574%20574%200%20017-40l-2%202c0%202-1%204-4%205l-4%205c-1%202-1%202-1%200%200-3%201-4%204-6%203-1%204-3%204-4%200-2-1-2-17-2H0v44M241%206l-7%202h-7c-2-2-2-2-4%200s-2%202-1%203c3%202%205%202%2013%200l6-1%201%207%202%2010%203%209%201%206c1%200%201-5-2-16a214%20214%200%2001-4-18V7c0-2%200-2-1-1M123%208l-18%202c-5%201%200%202%209%202l10%201%202%2023%201%2022-2%202c-2%202-2%202-1%203l4%203%207%204h20l5-3c5-2%207-1%207%202%200%202%201%202%202-1%203-4%205-3%203%201v4c1%203%204%201%204-3-1-2%200-3%202%200h1v6l2-3%203-5c-1-1%200-2%201-3%202-2%205-7%203-7l-4%204-3%204v-3l1-3%202-1%204-2c2-1%202-1%201-2s-2%200-4%202-3%202-3%201c-1-3%204-7%208-8%202%200%202-1%201-1-2%200-2%200%200-2%203-4-2-1-9%205-2%202-3%202-4%200-1-1-1-1-4%202-6%207-4%207-24%206h-19V43l-2-24v-6h27l27-1%202-3c2%200%202%200%201-1h-63m57%2010l-8%201h-7v6h7l6%201-6%201c-7%200-7%200-7%203%200%202%200%202%209%202%208%200%2010%200%2010%202h6v-5c2-1%200-10-2-11l-3%202-1%202-1%203-1%202v-5c0-6%200-8-2-4m-39%204c0%204%200%204%2012%203h10v-6h-22v3m-22%209c-1%204-2%205-5%205-5%200-5%204%201%209%204%204%205%205%204%206l1%204c1%203%203%205%204%204l-1-2v-1c1%200%201-18-1-26l-1-3-2%204m22-1v3h22v-6h-22v3m134%2010c1%208%201%207%209%2016l4%205%201%202c2%200%201-4%200-7-2-2-2-5-1-5%203%200%201-5-4-10-4-4-5-5-5-3l-1-1-2-4-1%207m-134-5c-1%204%200%205%2011%205%2010%200%2011-1%2011-3s-1-3-11-3l-11%201M19%2039c-3%204-5%208-2%208%201-1%202%201%200%202s-3%205-2%206c1%200%200%202-2%203-2%203-3%205-1%205l1%203c1%207%205%200%207-10%200-4%200-4-1-3h-2l1-2c2-1%203-6%202-6v-3l2-4c0-1-1-1-3%201m123%206v2h10c10%200%2011-1%2011-3s0-2-10-2h-11v3m102-2v9c1%2010%203%2014%206%2017%205%203%206%2012%204%2019-2%206-2%206%200%209%202%204%202%204%205-4%202-8%202-8%200-11-3-4-3-6%201-5h13l-8-4-9-2v-8l-1-7c-1%200-3%202-3%205-1%201-1%201-1-1l-2-2c-2%200-3-3-1-4v-2l-1-5c0-5-1-6-3-4m32%209l1%207c0%204%201%206%205%2011l5%206v-4l1-3%201%203%201%204v-5l-2-6-2-2-4-6c-4-6-7-8-6-5M64%2075c-2%205-2%205%200%206%203%203%200%204-5%202-7-3-6-3-9%202s-3%205-2%200v-6l-1%202c0%202-8%2018-19%2036l-10%2019%204-5c17-28%2018-29%2021-28l9%202c8%200%2011%201%2011%204-1%203%200%202%202-1%201-4%202-4-10-9-11-4-12-4-10-6%200-2%202-1%2011%203l11%204c1%200%209-16%209-19s0-3-2-4c-5-2-6-3-6-5%200-4-2-3-4%203m51%204c0%203%202%208%206%2012l4%209a832%20832%200%20006%2018c3%205%204%206%204%204l-1-3c-2-1-5-14-4-16l-4-10-5-10c0-5-5-8-6-4m131%2017l-7%203c-3%200-20%207-20%208%201%200-1%202-3%202l-6%204c0%202-2%203-3%203-2%200-2%200-1-1s1-1-1-1l-2%201-3%201c-5%201-9%204-9%206l1%201c2%200%201%202-1%204l-2%202h4l-5%203c-2%200-2%202-1%2014%201%207%202%208%203%208l3-2%202-2v-1c-2-1-2-1%200-2l5-1c1%201%205-2%205-5%200-2%202-4%202-2l2%201c2%200%201-2-1-4s-1-3%206-7l7-8%207-7c4-3%205-5%204-6-1-5%2012-6%2020-3%205%203%206%202%202-4-3-5-5-7-8-5m-128%204c0%201-1%202-3%202-4%201-4%201%202%208%206%206%206%209%203%2014-2%202-3%203-2%205l2%202%204-2c3-1%203-2%203-5%200-4-4-16-5-18l-2-3-1-4-1%201m-16%204v4l1%203-2-3c-2-2-3-2-4-1s0%202%203%205c5%204%207%208%202%204-3-2-4-2-2%201l2%202v2c2%202%202%206%200%2010l-1%205c1%200%206-3%206-5l4%201c4%202%205%202%202-3l-3-4c0-6-2-13-3-15-4-4-1-3%203%201l6%204-4-5-6-6h-4m179%205l-1%203c-1%201-1%202%201%206l2%209%203%205v-2c0-5%200-5%2011-1%2013%204%2014%204%2013%202l-18-8c-6-1-8-4-8-8l-2-8-1%202'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/610006b9d4183de78aac0197b73f3fd8/467f6/dark-star-1974.jpg",
                  srcSet:
                    "/static/610006b9d4183de78aac0197b73f3fd8/9225b/dark-star-1974.jpg 151w,\n/static/610006b9d4183de78aac0197b73f3fd8/4f425/dark-star-1974.jpg 184w,\n/static/610006b9d4183de78aac0197b73f3fd8/58a2e/dark-star-1974.jpg 238w,\n/static/610006b9d4183de78aac0197b73f3fd8/2502d/dark-star-1974.jpg 302w,\n/static/610006b9d4183de78aac0197b73f3fd8/467f6/dark-star-1974.jpg 321w,\n/static/610006b9d4183de78aac0197b73f3fd8/29154/dark-star-1974.jpg 368w,\n/static/610006b9d4183de78aac0197b73f3fd8/019d5/dark-star-1974.jpg 476w,\n/static/610006b9d4183de78aac0197b73f3fd8/82a3f/dark-star-1974.jpg 642w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/610006b9d4183de78aac0197b73f3fd8/3549e/dark-star-1974.avif 151w,\n/static/610006b9d4183de78aac0197b73f3fd8/eb4a3/dark-star-1974.avif 184w,\n/static/610006b9d4183de78aac0197b73f3fd8/2b27f/dark-star-1974.avif 238w,\n/static/610006b9d4183de78aac0197b73f3fd8/22006/dark-star-1974.avif 302w,\n/static/610006b9d4183de78aac0197b73f3fd8/42906/dark-star-1974.avif 321w,\n/static/610006b9d4183de78aac0197b73f3fd8/e5c3e/dark-star-1974.avif 368w,\n/static/610006b9d4183de78aac0197b73f3fd8/d7443/dark-star-1974.avif 476w,\n/static/610006b9d4183de78aac0197b73f3fd8/5bf7b/dark-star-1974.avif 642w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0074156",
        title: "Assault on Precinct 13",
        year: 1976,
        lastReviewGrade: "A-",
        reviewedMovieSlug: "assault-on-precinct-13-1976",
        sortTitle: "Assault on Precinct 13 (1976)",
        releaseDate: "1976-10-08",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M0%2067a479%20479%200%20002%2081c2%209%203%209%2013%209%2014%200%2023%202%2023%205%200%205-8%205-22%200-12-4-16-5-16-2%200%202%206%204%2015%206l4%201h-3c-3%201-5%201-12-2-3-1%201%203%206%206%205%204%206%205%203%205-5-1-13%201-13%203s3%203%209%201h4l49%201h48l-1-5%201-5%202%206v4h48c46%200%2047%200%2046-2-2-3-1-3%204-1%205%203%209%204%209%201l-1-3c-2-1%200-3%202-3v-1c-2-2-2-2%201-5%202-3%203-5%202-6s2-4%203-4l2-2c0-2%200-2-1-1-3%202-4-1-2-4v-3h-1c0%202%200%202-2%202l-2-1%201-1-2-2-1-5c0-4%200-4-2-2l-2%204c-1%201-1%200-1-2%200-8%205-27%208-31%204-5%2012-9%2018-11%204%200%204%200%205%203l3%203c2-1%200%202-3%206l-1-1c-1-1-1-1-1%201%201%204%200%206-2%203-1-2-3-2-3%201s3%207%205%206l1%201-2%201c-2%200-3%204%200%205%201%201%201%201-1%204l-2%203-6%2013%201%201v1c0%202%201%203%203%201v-2c-2-1-2-2%202-4l4-3h2c2%200%202%200%202-4l11-11%204-2h4c2%201%204%200%204-3-1-3%201-5%206-5%203%200%204%200%208-6%202-4%205-7%206-7v-1h-3l-1%201h-2c-3%201-2-4%201-7l2-3%202%201%2016%2010c9%205%2017%2014%2017%2018h-1c-2-2-3-1-2%203l-1%205h-1l-1-1-3-1-1-3c-1-2-1-2-1%203s0%206-2%206l-1-7c1-8-1-7-4%203-1%205-5%2012-5%209l2-5v-4l1-1c2-3%201-6-1-5l-2-1c2-5%202-5-1-2-4%204-8%2019-6%2019v1c-4%201-6%200-6-2v-1l-7%208%205-12%202-4c0-2-4%202-6%206l-6%208c-4%205-5%207-4%208v6c-1%203-1%204-4%204l-3%201-5%201c-2%200-3%200-2%201l-2%201c-2%200-3%201-3%202h-1c0-1-1-1-3%201-3%202-4%204-1%202%204-2%204%200%201%203-4%203-5%205-2%204v1c-1%203%202%202%205%200l3-4%202-1c2-1%201%203-2%205l-1%201%2035%201h36V0H0v67m262-41c2%202%202%202%200%202l-1%202h4c1-1%202-1%202%201h4c1-2%205-1%206%201l2%202h2c1%201%208%201%208-1l-8-4c-6-3-8-4-14-4s-6%200-5%201m-160%208c-2%202-2%208-1%209l1%202c-1%200-2%202-2%208l-1%203-1%202c-1%202%203%208%206%208v3l1%202%202%201%202%203c1%202%202%202%204%200l5-1c2%200%202%200%202-3s-1-3-3-3l-2-1%204-1c7%200%207-1%202-8l-4-9c1-2-1-13-3-15-1-1-12-2-12%200m162%2010v1l-2%202-2%202%202%201c2%200%203%201%203%202%201%202-2%204-4%203l-3-1c-2%200-1%202%204%204%208%204%209%209%203%207-3%200-3%200-2%202l1%203%203%201c1%201%202%202%205%201l4-1v-2l1-3c2%200%200-4-2-6-4-2-4-4-2-8v-4c-1%200-1-1%201-1v-3h-10M58%2085v4l-2-1h-3l-5%201-10%205-10%206c-3%200-5%202-6%203%200%202-1%202-1%201h-3l1%201-1%202c-3%203-2%202%204%200%205-3%2014-3%2018-1%202%201%202%201-3%201-8%200-8%200-14%203-5%202-11%207-11%208l-2%204-2%203h2c2-1%203-1%203%201l-3%202-2%201h12c0%202-1%202-3%201-1-1-2-1-4%201l-4%202-3%202c-1%202%201%202%203%201l2-1h1c2-3%209-2%2010%201%200%203%202%202%203-1l1-3%203%203%202%205c0%201%201%201%201-1h2l1%201c2-1%201%201-1%203-2%204%200%209%205%2014l4%204%204-4%207-5%203-1%201-3-1-1-1%201v-4c-1-3%200-5%201-3s2%202%203%201%202%200%206%203l3%202c1%201%200%201-1%201-5%200-4%202%200%202h5l-5%201-4%202%202%205%201%203c0-4%205-3%205%200l3%203%203%202h-3l-5-2c-4-3-4-1-1%202%203%202%207%203%2011%201v-1l-2-1-1-4c0-2%200-3%201-2l2%202%201%202%201-1%201-2c1%200%202%201%202%203%200%203%200%203%203%203%205%200%207-1%207-2h-1v-4c2-5%203-18%201-19l-1-6-2-7-5-7-4-6%204-5%204-6c1%200%201-1-2-6v-4l-3-5c-4-3-5-4-4-2%200%202-4%202-6%201v2c3%203%200%202-5-1l-5-3-3-1h-5m36%2011l1%203c2%202%202%203-1%204l-1%202%201%202c-1%201%200%202%201%203l1%201h-1c-2-2-5-1-3%200%202%202%200%205-2%203l1%203c1%202%201%202%203%200%201-1%201-1%201%203s0%204%201-1c0-5%201-6%202-6l1-1c-1-1%200-3%202-4l1-3c-5-8-8-12-8-9m-80%2039c-1%201-1%201%201%201s2%200%202%202l-1%202-1%201-1-1c1-2-1-3-2-2l-4%201c-1-1-2%200-3%201s-2%201-2-2c-1-2-1-1-1%203%200%207%204%2013%208%2014%202%200%202%200%200-1-2%200-7-8-6-10%201-1%205%201%205%203%200%203%201%203%204%202%202-1%203-1%205%201%204%203%204%203%203-1%200-3-1-3-3-2h-2l2-2c2-2%203-3%201-3-1%200-2-1-1-2l1%201h2l-2-4c-3-3-3-3-5-2'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/9b0b083ca27d9f2fd08697348e679ec7/467f6/assault-on-precinct-13-1976.jpg",
                  srcSet:
                    "/static/9b0b083ca27d9f2fd08697348e679ec7/9225b/assault-on-precinct-13-1976.jpg 151w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/4f425/assault-on-precinct-13-1976.jpg 184w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/58a2e/assault-on-precinct-13-1976.jpg 238w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/2502d/assault-on-precinct-13-1976.jpg 302w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/467f6/assault-on-precinct-13-1976.jpg 321w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/29154/assault-on-precinct-13-1976.jpg 368w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/019d5/assault-on-precinct-13-1976.jpg 476w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/82a3f/assault-on-precinct-13-1976.jpg 642w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/9b0b083ca27d9f2fd08697348e679ec7/3549e/assault-on-precinct-13-1976.avif 151w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/eb4a3/assault-on-precinct-13-1976.avif 184w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/2b27f/assault-on-precinct-13-1976.avif 238w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/22006/assault-on-precinct-13-1976.avif 302w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/42906/assault-on-precinct-13-1976.avif 321w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/e5c3e/assault-on-precinct-13-1976.avif 368w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/d7443/assault-on-precinct-13-1976.avif 476w,\n/static/9b0b083ca27d9f2fd08697348e679ec7/5bf7b/assault-on-precinct-13-1976.avif 642w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0077651",
        title: "Halloween",
        year: 1978,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Halloween (1978)",
        releaseDate: "1978-10-25",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0080749",
        title: "The Fog",
        year: 1980,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Fog (1980)",
        releaseDate: "1980-01-01",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0082340",
        title: "Escape from New York",
        year: 1981,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Escape from New York (1981)",
        releaseDate: "1981-04-01",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0084787",
        title: "The Thing",
        year: 1982,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Thing (1982)",
        releaseDate: "1982-06-25",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0085333",
        title: "Christine",
        year: 1983,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Christine (1983)",
        releaseDate: "1983-12-09",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0088172",
        title: "Starman",
        year: 1984,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Starman (1984)",
        releaseDate: "1984-12-14",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0090728",
        title: "Big Trouble in Little China",
        year: 1986,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Big Trouble in Little China (1986)",
        releaseDate: "1986-07-02",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0093777",
        title: "Prince of Darkness",
        year: 1987,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Prince of Darkness (1987)",
        releaseDate: "1987-10-21",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0096256",
        title: "They Live",
        year: 1988,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "They Live (1988)",
        releaseDate: "1988-11-04",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0104850",
        title: "Memoirs of an Invisible Man",
        year: 1992,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Memoirs of an Invisible Man (1992)",
        releaseDate: "1992-02-28",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0113409",
        title: "In the Mouth of Madness",
        year: 1995,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "In the Mouth of Madness (1994)",
        releaseDate: "1994-12-10",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0114852",
        title: "Village of the Damned",
        year: 1995,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Village of the Damned (1995)",
        releaseDate: "1995-04-28",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0116225",
        title: "Escape from L.A.",
        year: 1996,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Escape from L.A. (1996)",
        releaseDate: "1996-08-09",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0120877",
        title: "Vampires",
        year: 1998,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Vampires (1998)",
        releaseDate: "1998-04-15",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt0228333",
        title: "Ghosts of Mars",
        year: 2001,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Ghosts of Mars (2001)",
        releaseDate: "2001-08-24",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
      {
        imdbId: "tt1369706",
        title: "The Ward",
        year: 2010,
        lastReviewGrade: null,
        reviewedMovieSlug: null,
        sortTitle: "Ward (2010)",
        releaseDate: "2010-09-13",
        backdrop: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "constrained" as Layout,
              placeholder: {
                fallback:
                  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='321'%20height='181'%20viewBox='0%200%20321%20181'%20preserveAspectRatio='none'%3e%3cpath%20d='M181%2054c-1%204-7%208-11%208l2-4c3-5%202-5-3-3-4%201-5%202-7%206-2%205-3%206-7%207s-4%201-3-3l2-4-5%201c-4%202-5%202-7%208l-3%206c0%201%2047-16%2048-18l-3-8-3%204m-41%2026l4%205%204%204h-21v17l1%2019c2%202%2060%201%2062-1%202-1%202-4%202-22%200-24%200-23-7-23-4%200-4%200%202%206l4%204h-5c-5%200-6%200-10-5-5-5-6-5-10-5-6%200-6%200-1%206l4%204h-5c-4%200-5%200-9-5-5-5-6-5-10-5l-5%201'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
              },
              images: {
                fallback: {
                  src: "/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg",
                  srcSet:
                    "/static/24b73c510626faf8cc2c00f5686ebe83/9225b/default.jpg 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/4f425/default.jpg 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/58a2e/default.jpg 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2502d/default.jpg 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/467f6/default.jpg 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/29154/default.jpg 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/019d5/default.jpg 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/ad189/default.jpg 640w",
                  sizes:
                    "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/24b73c510626faf8cc2c00f5686ebe83/3549e/default.avif 151w,\n/static/24b73c510626faf8cc2c00f5686ebe83/eb4a3/default.avif 184w,\n/static/24b73c510626faf8cc2c00f5686ebe83/2b27f/default.avif 238w,\n/static/24b73c510626faf8cc2c00f5686ebe83/22006/default.avif 302w,\n/static/24b73c510626faf8cc2c00f5686ebe83/42906/default.avif 321w,\n/static/24b73c510626faf8cc2c00f5686ebe83/e5c3e/default.avif 368w,\n/static/24b73c510626faf8cc2c00f5686ebe83/d7443/default.avif 476w,\n/static/24b73c510626faf8cc2c00f5686ebe83/a53c3/default.avif 640w",
                    type: "image/avif",
                    sizes:
                      "(max-width: 379px) 321px, (max-width: 555px) 238px, (max-width: 1279) 184px, (max-width: 1343px) 238px, 151px",
                  },
                ],
              },
              width: 321,
              height: 181,
            },
          },
        },
      },
    ],
  },
};
