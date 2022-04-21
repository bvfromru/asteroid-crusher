import { params } from "../logic/params.js";
import { getRandom } from "../logic/utils.js";

export default function Particle(x, y, velocity, color, radius) {
  this.x = x;
  this.y = y;
  this.velocity = velocity;
  this.color = color;
  this.radius = radius;
  this.alpha = 1;
  this.markedForDeletion = false;
}

Particle.prototype = {
  
  draw(context) {
    const { PARTICLES_BLINKAGE_MULT, CIRCLE_FULL_ANGLE} = params;
    context.save();
    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(this.x, this.y, getRandom(this.radius, this.radius * PARTICLES_BLINKAGE_MULT), 0, CIRCLE_FULL_ANGLE);
    context.fillStyle = `hsl(${this.color.hue}, ${this.color.saturation}%, ${this.color.brightness}%)`;
    context.fill();
    context.restore();
  },

  update() {
    const { PARTICLES_FRICTION, PARTICLES_FADEOUT } = params;
    this.velocity.x *= PARTICLES_FRICTION;
    this.velocity.y *= PARTICLES_FRICTION;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= PARTICLES_FADEOUT;

    if (this.alpha <= 0.01) {
      this.markedForDeletion = true;
    }
  },
};
