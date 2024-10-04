export function OpenGraphImage({ year }: { year: string }): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        height: "630px",
        width: "1200px",
        backgroundColor: "#2A2B2A",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "1200px",
          height: "100%",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingBottom: "64px",
          paddingTop: "32px",
        }}
      >
        <div
          style={{
            fontFamily: "ArgentumSans",
            color: "#b0b0b0",
            marginBottom: "16px",
            textTransform: "uppercase",
            textShadow: "1px 1px 2px black",
          }}
        >
          Frank&apos;s Movie Log
        </div>
        <div
          style={{
            fontFamily: "FrankRuhlLibre",
            color: "#fff",
            fontSize: "72px",
            lineHeight: 1,
            display: "flex",
            fontWeight: 400,
            textShadow: "1px 1px 2px black",
          }}
        >
          {year} Stats
        </div>
      </div>
    </div>
  );
}
