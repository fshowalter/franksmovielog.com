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
            fontFamily: "FrankRuhlLibre",
            color: "#fff",
            fontSize: "72px",
            lineHeight: 1,
            display: "flex",
            fontWeight: 400,
            textShadow: "1px 1px 2px black",
          }}
        >
          Frank&apos;s Movie Log
        </div>
      </div>
    </div>
  );
}
