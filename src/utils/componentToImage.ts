import type { ReactNode } from "react";

import { Renderer } from "@takumi-rs/core";
import { fromJsx } from "@takumi-rs/helpers/jsx";
import fs from "node:fs/promises";

const fonts = [
  {
    data: await fs.readFile(
      "./public/fonts/Frank-Ruhl-Libre/Frank-Ruhl-Libre-ExtraBold.ttf",
    ),
    name: "FrankRuhlLibre",
    weight: 800,
  },
  {
    data: await fs.readFile(
      "./public/fonts/Frank-Ruhl-Libre/Frank-Ruhl-Libre-SemiBold.ttf",
    ),
    name: "FrankRuhlLibre",
    weight: 600,
  },
  {
    data: await fs.readFile("./public/fonts/Assistant/Assistant-Bold.ttf"),
    name: "Assistant",
    weight: 700,
  },
  {
    data: await fs.readFile("./public/fonts/Assistant/Assistant-SemiBold.ttf"),
    name: "Assistant",
    weight: 600,
  },
];

const renderer = new Renderer();

export async function componentToImageBytes(
  component: ReactNode,
  images: { data: ArrayBuffer; src: string }[],
): Promise<Buffer> {
  const { css, node } = await fromJsx(component);

  return await renderer.render(node, {
    css,
    fonts,
    format: "jpeg",
    height: 630,
    images,
    width: 1200,
  });
}

export async function componentToImageResponse(
  component: ReactNode,
  images: { data: ArrayBuffer; src: string }[],
): Promise<Response> {
  const image = await componentToImageBytes(component, images);

  return new Response(image as ArrayBufferView<ArrayBuffer>, {
    headers: {
      "Content-Type": "image/jpeg",
    },
  });
}
