import { params } from "../logic/params.js";

export default function GameoverText(gameWidth, gameHeight) {
  this.gameWidth = gameWidth;
  this.gameHeight = gameHeight;
}

GameoverText.prototype = {
  draw(context, score, bestScore) {
    const halfGameWidth = this.gameWidth * 0.5;
    const halfGameHeight = this.gameHeight * 0.5;
    const fontSizeMult = this.gameWidth * 0.05;
    const paddingBig = this.gameWidth * 0.05;
    const paddingSmall = this.gameWidth * 0.03;
    const HalfTextHeight = (paddingBig + 2 * paddingSmall) / 2;
    let x = halfGameWidth;
    let y;
    const { TITLE_FONT, MAIN_FONT } = params;

    context.fillStyle = params.FONT_COLOR;
    context.textAlign = "center";

    context.font = `${fontSizeMult}px ${TITLE_FONT}`;
    y = halfGameHeight - HalfTextHeight;
    context.fillText("GAME OVER", x, y);

    context.font = `${fontSizeMult * 0.3}px ${MAIN_FONT}`;
    if (score > bestScore) {
      y += paddingBig;
      context.fillText("Congratulations, you set a new record!", x, y);
      y += paddingSmall;
      context.fillText(`Your score is: ${score}`, x, y);
      localStorage.setItem("bestScore", score);
    } else {
      y += paddingBig;
      context.fillText(`Your score is: ${score}`, x, y);
      y += paddingSmall;
      context.fillText(`Best score is: ${bestScore}`, x, y);
    }

    context.font = `${fontSizeMult * 0.5}px ${MAIN_FONT}`;
    y += paddingBig;
    context.fillText("Press SPACE to Start again!", x, y);
  },
};
