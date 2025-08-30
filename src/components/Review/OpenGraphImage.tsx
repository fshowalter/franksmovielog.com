export type ReviewOpenGraphImageComponentType = (
  props: ReviewOpenGraphImageProps,
) => React.JSX.Element;

type ReviewOpenGraphImageProps = {
  backdrop: string;
  grade: string;
  releaseYear: string;
  title: string;
};

export function OpenGraphImage({
  backdrop,
  grade,
  releaseYear,
  title,
}: ReviewOpenGraphImageProps): React.JSX.Element {
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
            color: "#c29d52",
            fontFamily: "Assistant",
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "16px",
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
            fontSize: "54px",
            fontWeight: 600,
            lineHeight: 1,
            textWrap: "balance",
          }}
        >
          {title} ({releaseYear})
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
