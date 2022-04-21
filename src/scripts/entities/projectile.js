import { params } from "../logic/params.js";
import { soundPlay } from "../logic/utils.js";

export default function Projectile(x, y, velocity, isMuted) {
  this.x = x;
  this.y = y;
  this.velocity = velocity;
  this.isMuted = isMuted;
  this.markedForDeletion = false;
  this.soundShot = new Audio();
  this.soundShot.src = "./assets/sounds/pew.wav";
  this.soundExplode = new Audio();
  this.soundExplode.src = "./assets/sounds/explodemini.wav";
  this.playSoundShot();
}

Projectile.prototype = {
  playSoundShot() {
    soundPlay(this.soundShot, this.isMuted);
  },

  draw(context) {
    const { PROJECTILE_RADIUS, CIRCLE_FULL_ANGLE, PROJECTILE_COLOR } = params;
    context.beginPath();
    context.arc(this.x, this.y, PROJECTILE_RADIUS, 0, CIRCLE_FULL_ANGLE);
    context.fillStyle = PROJECTILE_COLOR;
    context.fill();
  },

  update(gameWidth, gameHeight) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    const { PROJECTILE_RADIUS } = params;
    if (
      this.x + PROJECTILE_RADIUS < 0 ||
      this.x - PROJECTILE_RADIUS > gameWidth ||
      this.y + PROJECTILE_RADIUS < 0 ||
      this.y - PROJECTILE_RADIUS > gameHeight
    ) {
      this.markedForDeletion = true;
    }
  },
};
