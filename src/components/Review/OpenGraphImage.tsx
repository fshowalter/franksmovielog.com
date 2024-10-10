export function OpenGraphImage({
  backdrop,
  grade,
  title,
  year,
}: {
  backdrop: string;
  grade: string;
  title: string;
  year: string;
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        height: "630px",
        position: "relative",
        width: "1200px",
      }}
    >
      <img
        height={630}
        src={backdrop}
        style={{
          objectFit: "cover",
        }}
        width={600}
      />
      <div
        style={{
          backgroundColor: "#252525",
          display: "flex",
          flexDirection: "column",
          height: "630px",
          justifyContent: "center",
          paddingBottom: "32px",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingTop: "32px",
          width: "600px",
        }}
      >
        <div
          style={{
            color: "#b0b0b0",
            fontFamily: "ArgentumSans",
            marginBottom: "24px",
            textTransform: "uppercase",
          }}
        >
          Frank&apos;s Movie Log
        </div>
        <div
          style={{
            color: "#fff",
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "FrankRuhlLibre",
            fontSize: "64px",
            lineHeight: 1,
            textWrap: "balance",
          }}
        >
          {title} ({year})
        </div>

        <img
          height={48}
          src={grade}
          style={{ marginTop: "36px" }}
          width={240}
        />
      </div>
    </div>
  );
}
