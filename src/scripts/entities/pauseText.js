import { params } from "../logic/params.js";

export default function PauseText() {}

PauseText.prototype = {
  draw(context, gameWidth, gameHeight) {
    const halfGameWidth = gameWidth * 0.5;
    const halfGameHeight = gameHeight * 0.5;
    const fontSizeMult = gameWidth * 0.05;
    const HalfTextHeight = fontSizeMult * 0.3;
    context.fillStyle = params.FONT_COLOR;
    context.textAlign = "center";
    context.font = `${fontSizeMult}px ${params.TITLE_FONT}`;
    context.fillText("PAUSE", halfGameWidth, halfGameHeight + HalfTextHeight);
  },
};
