import { params } from "../logic/params.js";
import { getRandom, getRandomInt } from "../logic/utils.js";

export default function Asteroid(x, y, velocity, color, initialSize) {
  this.x = x;
  this.y = y;
  this.velocity = velocity;
  this.color = color;
  this.initialSize = initialSize;
  this.sizeVariability = this.initialSize * params.ASTEROID_SIZE_VARIABILITY;
  this.radius = initialSize * 0.5 + getRandom(-this.sizeVariability, this.sizeVariability);
  this.diameter = this.radius * 2;
  this.image = document.getElementById("asteroidImage");
  this.angle = Math.random() * Math.PI;
  this.rotateSpeed = getRandom(-params.ASTEROID_ROTATION_SPEED, params.ASTEROID_ROTATION_SPEED) / this.initialSize;
  this.frameX = getRandomInt(0, 4);
  this.sound = new Audio();
  this.sound.src = `./assets/sounds/explosion${getRandomInt(1, 9)}.wav`;
}

Asteroid.prototype = {
  draw(context) {
    const { ASTEROID_IMAGE_SIZE } = params;
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.filter = `
    hue-rotate(${this.color.hue}deg)
    saturate(${this.color.saturation}%)
    brightness(${this.color.brightness}%)
  `;
    context.drawImage(
      this.image,
      ASTEROID_IMAGE_SIZE * this.frameX,
      0,
      ASTEROID_IMAGE_SIZE,
      ASTEROID_IMAGE_SIZE,
      -this.radius,
      -this.radius,
      this.diameter,
      this.diameter
    );
    context.restore();
  },

  update(gameWidth, gameHeight) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.angle += this.rotateSpeed;
    const { CIRCLE_FULL_ANGLE } = params;

    if (this.angle >= CIRCLE_FULL_ANGLE) {
      this.angle = CIRCLE_FULL_ANGLE - this.angle;
    }

    if (this.x + this.diameter < 0 || this.x - this.diameter > gameWidth || this.y + this.diameter < 0 || this.y - this.diameter > gameHeight) {
      this.markedForDeletion = true;
    }
  },
};
