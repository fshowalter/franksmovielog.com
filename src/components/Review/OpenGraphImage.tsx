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
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        width={1200}
        height={627}
      />
      <div
        style={{
          backgroundImage:
            "linear-gradient(5deg, #252525bf 200px, transparent 60%)",
          backgroundSize: "100% 100%",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          bottom: 0,
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingBottom: "32px",
          paddingTop: "32px",
          width: "1200px",
        }}
      >
        <span
          style={{
            fontFamily: "ArgentumSans",
            fontWeight: "bold",
            color: "#fff",
            fontSize: "72px",
            textTransform: "uppercase",
            textWrap: "balance",
            display: "flex",
          }}
        >
          {title}
        </span>

        <img src={grade} height={32} width={160} />
      </div>
    </div>
  );
}
