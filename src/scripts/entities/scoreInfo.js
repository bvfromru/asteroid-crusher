import { params } from "../logic/params.js";

export default function ScoreInfo(gameWidth, gameHeight, score) {
  this.score = score;
  this.gameWidth = gameWidth;
  this.gameHeight = gameHeight;
}

ScoreInfo.prototype = {
  update(score) {
    this.score = score;
  },

  draw(context) {
    const { FONT_COLOR, SCORE_FONT_SIZE, MAIN_FONT, HUD_HORIZONTAL_OFFSET, HUD_VERTICAL_FONT_OFFSET } = params;

    context.fillStyle = FONT_COLOR;
    context.font = `${SCORE_FONT_SIZE}px ${MAIN_FONT}`;
    context.textAlign = "start";
    context.fillText("Score: " + this.score, HUD_HORIZONTAL_OFFSET, HUD_VERTICAL_FONT_OFFSET);
  },
};
