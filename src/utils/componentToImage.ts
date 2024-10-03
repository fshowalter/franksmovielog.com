import fs from "fs/promises";
import satori from "satori";
import sharp from "sharp";

export async function componentToSvg(component: JSX.Element) {
  return await satori(component, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "ArgentumSans",
        data: await fs.readFile(
          "./public/fonts/ArgentumSans/ArgentumSans-Regular.ttf",
        ),
        weight: 400,
      },
      {
        name: "ArgentumSans",
        data: await fs.readFile(
          "./public/fonts/ArgentumSans/ArgentumSans-SemiBold.ttf",
        ),
        weight: 700,
      },
    ],
  });
}

export async function componentToPng(component: JSX.Element) {
  return await sharp(Buffer.from(await componentToSvg(component)))
    .png()
    .toBuffer();
}
