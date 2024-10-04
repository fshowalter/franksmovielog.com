export function OpenGraphImage({
  name,
  avatar,
}: {
  name: string;
  avatar: string;
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "630px",
        width: "1200px",
        backgroundColor: "#2A2B2A",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={avatar}
        style={{
          objectFit: "cover",
          borderRadius: "50%",
        }}
        width={250}
        height={250}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingBottom: "64px",
          paddingTop: "32px",
          width: "1200px",
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
            fontFamily: "ArgentumSans",
            color: "#fff",
            fontSize: "88px",
            lineHeight: 1,
            textWrap: "balance",
            display: "flex",
            flexWrap: "wrap",
            fontWeight: 600,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}
