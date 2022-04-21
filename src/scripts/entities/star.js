import { getRandom, getRandomInt } from "../logic/utils.js";
import { params } from "../logic/params.js";

export default function Star(gameWidth, gameHeight) {
  this.gameWidth = gameWidth;
  this.gameHeight = gameHeight;
  this.x = getRandomInt(0, this.gameWidth);
  this.y = getRandomInt(0, this.gameHeight);
  this.color = `hsl(${getRandomInt(45, 65)}, 10%, ${getRandomInt(40, 100)}%)`;
  this.blinkageMult = getRandom(0.9, 2);
  this.secondBlinkageMult = Math.random();
  this.size = Math.random();
  this.fps = getRandom(5, 15);
  this.frameTimer = 0;
  this.frameInterval = 1000 / this.fps;
}

Star.prototype = {
  draw(context, deltaTime) {
    if (this.frameTimer > this.frameInterval) {
      this.secondBlinkageMult = Math.random();
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.size + this.secondBlinkageMult * this.blinkageMult,
      0,
      params.CIRCLE_FULL_ANGLE
    );
    context.fillStyle = this.color;
    context.fill();
  },
}
