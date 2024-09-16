export type NavItem = {
  text: string;
  target: string;
  subItems: NavItem[];
};

export const navItems: NavItem[] = [
  {
    text: "Home",
    target: "/",
    subItems: [],
  },
  {
    text: "How I Grade",
    target: "/how-i-grade/",
    subItems: [],
  },
  {
    text: "Reviews",
    target: "/reviews/",
    subItems: [
      {
        text: "Underseen Gems",
        target: "/reviews/underseen/",
        subItems: [],
      },
      {
        text: "Overrated Disappointments",
        target: "/reviews/overrated/",
        subItems: [],
      },
    ],
  },
  {
    text: "Viewing Log",
    target: "/viewings/",
    subItems: [
      {
        text: "Stats",
        target: "/viewings/stats/",
        subItems: [],
      },
    ],
  },
  {
    text: "Cast & Crew",
    target: "/cast-and-crew/",
    subItems: [],
  },
  {
    text: "Collections",
    target: "/collections/",
    subItems: [],
  },
  {
    text: "Watchlist",
    target: "/watchlist/",
    subItems: [
      {
        text: "Progress",
        target: "/watchlist/progress/",
        subItems: [],
      },
    ],
  },
];
