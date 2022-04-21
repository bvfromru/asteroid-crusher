import { params } from "../logic/params.js";
import { soundPlay } from "../logic/utils.js";

export default function Explosion(x, y, isMuted) {
  this.x = x;
  this.y = y;
  this.isMuted = isMuted;
  this.image = document.getElementById("explosionImage");
  this.frameX = 0;
  this.maxFrame = 14;
  this.fps = 20;
  this.frameTimer = 0;
  this.frameInterval = 1000 / this.fps;
  this.sound = new Audio();
  this.sound.src = "./assets/sounds/explode.wav";
  this.playSound();
}

Explosion.prototype = {
  playSound() {
    soundPlay(this.sound, this.isMuted);
  },

  draw(context) {
    const { EXPLOSION_IMAGE_SIZE } = params;
    if (this.frameX <= 15) {
      context.drawImage(
        this.image,
        EXPLOSION_IMAGE_SIZE * this.frameX,
        0,
        EXPLOSION_IMAGE_SIZE,
        EXPLOSION_IMAGE_SIZE,
        this.x - EXPLOSION_IMAGE_SIZE / 2,
        this.y - EXPLOSION_IMAGE_SIZE / 2,
        EXPLOSION_IMAGE_SIZE,
        EXPLOSION_IMAGE_SIZE
      );
    }
  },

  update(deltaTime) {
    if (this.frameX <= 15) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX <= this.maxFrame) {
          this.frameX++;
        }
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }
  },
};
