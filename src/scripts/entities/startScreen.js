import { params } from "../logic/params.js";

export default function StartScreen(gameWidth, gameHeight, bestScore) {
  this.gameWidth = gameWidth;
  this.gameHeight = gameHeight;
  this.bestScore = bestScore;
}

StartScreen.prototype = {
  draw(context) {
    const halfGameWidth = this.gameWidth * 0.5;
    const halfGameHeight = this.gameHeight * 0.5;
    const fontSizeMult = this.gameWidth * 0.05;
    const paddingBig = this.gameWidth * 0.06;
    const paddingSmall = this.gameWidth * 0.03;
    const HalfTextHeight = (2 * paddingBig + 2 * paddingSmall) / 2;
    let x = halfGameWidth;
    let y;
    const { FONT_COLOR, TITLE_FONT, MAIN_FONT } = params;
    
    context.fillStyle = FONT_COLOR;
    context.textAlign = "center";

    context.font = `${fontSizeMult}px ${TITLE_FONT}`;
    y = halfGameHeight - HalfTextHeight;
    context.fillText("ASTEROID CRUSHER", x, y);
    context.font = `${fontSizeMult * 0.5}px ${MAIN_FONT}`;

    y += paddingBig;
    context.fillText(`Best Score: ${this.bestScore}`, x, y);

    y += paddingBig;
    context.font = `${fontSizeMult * 0.7}px ${MAIN_FONT}`;
    context.fillText("Press SPACE to Start!", x, y);

    context.font = `${fontSizeMult * 0.3}px ${MAIN_FONT}`;
    y += paddingBig;
    context.fillText("Use WASD or Arrow keys to move, Mouse to aim and shoot", x, y);

    y += paddingSmall;
    context.fillText("M to mute sound, P to pause game", x, y);

    y += paddingSmall;
    context.fillText("I recommend to use your browser's fullscreen mode!", x, y);
  },
};
