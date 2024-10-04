export function OpenGraphImage({
  title,
  year,
  backdrop,
  grade,
}: {
  title: string;
  year: string;
  backdrop: string;
  grade: string;
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        height: "627px",
        width: "1200px",
      }}
    >
      <img
        src={backdrop}
        style={{
          objectFit: "cover",
        }}
        width={600}
        height={630}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingBottom: "32px",
          paddingTop: "32px",
          width: "600px",
          height: "630px",
          backgroundColor: "#252525",
        }}
      >
        <div
          style={{
            fontFamily: "ArgentumSans",
            color: "#b0b0b0",
            marginBottom: "24px",
            textTransform: "uppercase",
          }}
        >
          Frank&apos;s Movie Log
        </div>
        <div
          style={{
            fontFamily: "FrankRuhlLibre",
            color: "#fff",
            fontSize: "64px",
            lineHeight: 1,
            textWrap: "balance",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {title} ({year})
        </div>

        <img
          src={grade}
          height={48}
          width={240}
          style={{ marginTop: "36px" }}
        />
      </div>
    </div>
  );
}
