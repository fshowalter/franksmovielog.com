// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from "@testing-library/react";
import React from "react";
import HomePage from "./HomePage";
import data from "./HomePage.fixtures";

describe("/", () => {
  it("renders", () => {
    const { asFragment } = render(
      <HomePage
        data={data}
        pageContext={{
          limit: 10,
          skip: 0,
          numberOfItems: 102,
          currentPage: 1,
        }}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  // Helmet uses requestAnimationFrame to ensure DOM is synced.
  // https://github.com/nfl/react-helmet/blob/master/test/HelmetDeclarativeTest.js
  // eslint-disable-next-line jest/no-done-callback
  it("sets page title for first page", (done) => {
    expect.hasAssertions();
    render(
      <HomePage
        data={data}
        pageContext={{
          limit: 10,
          skip: 0,
          numberOfItems: 102,
          currentPage: 1,
        }}
      />
    );

    requestAnimationFrame(() => {
      expect(document.title).toStrictEqual(
        "Frank's Movie Log: My Life at the Movies"
      );
      done();
    });
  });

  // Helmet uses requestAnimationFrame to ensure DOM is synced.
  // https://github.com/nfl/react-helmet/blob/master/test/HelmetDeclarativeTest.js
  // eslint-disable-next-line jest/no-done-callback
  it("sets page title for not-first page", (done) => {
    expect.hasAssertions();
    render(
      <HomePage
        data={data}
        pageContext={{
          limit: 10,
          skip: 10,
          numberOfItems: 102,
          currentPage: 2,
        }}
      />
    );

    requestAnimationFrame(() => {
      expect(document.title).toStrictEqual("Page 2");
      done();
    });
  });
});
