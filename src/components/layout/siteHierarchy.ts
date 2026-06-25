type SitePage = {
  href: string;
  subPages: SubPage[];
  title: string;
};

type SubPage = Omit<SitePage, "subPages">;

export const siteHierarchy: SitePage[] = [
  {
    href: "/",
    subPages: [],
    title: "Home",
  },
  {
    href: "/how-i-grade/",
    subPages: [],
    title: "How I Grade",
  },
  {
    href: "/reviews/",
    subPages: [
      {
        href: "/cast-and-crew/",
        title: "Cast & Crew",
      },
      {
        href: "/collections/",
        title: "Collections",
      },
      {
        href: "/reviews/overrated/",
        title: "Overrated",
      },
      {
        href: "/reviews/underrated/",
        title: "Underrated",
      },
      {
        href: "/reviews/underseen/",
        title: "Underseen",
      },
    ],
    title: "Reviews",
  },
  {
    href: "/viewings/",
    subPages: [
      {
        href: "/viewings/stats/",
        title: "Stats",
      },
    ],
    title: "Viewing Log",
  },

  {
    href: "/watchlist/",
    subPages: [
      {
        href: "/watchlist/progress/",
        title: "Progress",
      },
    ],
    title: "Watchlist",
  },
];
