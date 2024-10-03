import fs from "fs/promises";
import satori from "satori";
import sharp from "sharp";

export async function componentToSvg(component: JSX.Element) {
  return await satori(component, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "FrankRuhlLibre",
        data: await fs.readFile(
          "./public/fonts/Frank-Ruhl-Libre/Frank-Ruhl-Libre-Regular.ttf",
        ),
        weight: 400,
      },
      {
        name: "ArgentumSans",
        data: await fs.readFile(
          "./public/fonts/ArgentumSans/ArgentumSans-Regular.ttf",
        ),
        weight: 400,
      },
    ],
  });
}

export async function componentToPng(component: JSX.Element) {
  return await sharp(Buffer.from(await componentToSvg(component)))
    .jpeg()
    .toBuffer();
}
