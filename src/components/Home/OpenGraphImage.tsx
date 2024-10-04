export function OpenGraphImage({
  backdrop,
}: {
  backdrop: string;
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        height: "630px",
        width: "1200px",
      }}
    >
      <img
        src={backdrop}
        style={{
          objectFit: "cover",
        }}
        width={1200}
        height={630}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingBottom: "64px",
          paddingTop: "32px",
          width: "1200px",
          position: "absolute",
          bottom: 0,
        }}
      >
        <div
          style={{
            fontFamily: "ArgentumSans",
            color: "#fff",
            fontSize: "88px",
            lineHeight: 1,
            textWrap: "balance",
            display: "flex",
            flexWrap: "wrap",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}
