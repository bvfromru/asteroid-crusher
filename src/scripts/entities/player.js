import Explosion from "./explosion.js";
import { params } from "../logic/params.js";

export default function Player(gameWidth, gameHeight, radius, addProjectile) {
  this.gameWidth = gameWidth;
  this.gameHeight = gameHeight;
  this.radius = radius;
  this.addProjectile = addProjectile;
  this.diameter = radius * 2;
  this.image = document.getElementById("playerImage");
  this.horizontalSpeed = 0;
  this.verticalSpeed = 0;
  this.frameX = 0;
  this.frameY = 0;
  this.maxFrame = 3;
  this.fps = 10;
  this.frameTimer = 0;
  this.frameInterval = 1000 / this.fps;
  this.sound = new Audio();
  this.sound.src = "./assets/sounds/enginehum.ogg";
  this.sound.loop = true;
  this.sound.volume = 0;
  this.init();
}

Player.prototype = {
  init() {
    this.soundVolume = 0;
    this.x = this.gameWidth * 0.5 - this.radius;
    this.y = this.gameHeight * 0.5 - this.radius;
    this.angle = params.PLAYER_ZERO_ANGLE;
    this.isAlive = true;
  },

  setAngle(cursorX, cursorY) {
    this.angle = Math.atan2(cursorY - this.y, cursorX - this.x);
  },

  shoot() {
    const { PROJECTILE_SPEED } = params;
    const velocity = {
      x: Math.cos(this.angle) * PROJECTILE_SPEED,
      y: Math.sin(this.angle) * PROJECTILE_SPEED,
    };
    const projectileX = this.x + this.radius;
    const projectileY = this.y + this.radius;
    this.addProjectile(projectileX, projectileY, velocity);
  },

  die(explosion, isMuted) {
    this.isAlive = false;
    this.horizontalSpeed = 0;
    this.verticalSpeed = 0;
    this.soundVolume = 0;
    explosion.push(new Explosion(this.x + this.radius, this.y + this.radius, isMuted));
  },

  draw(context) {
    const { PLAYER_IMAGE_WIDTH, PLAYER_IMAGE_HEIGHT } = params;
    if (this.isAlive) {
      context.save();
      context.translate(this.x + this.radius, this.y + this.radius);
      context.rotate(this.angle + Math.PI / 2);
      context.drawImage(
        this.image,
        PLAYER_IMAGE_WIDTH * this.frameX,
        PLAYER_IMAGE_HEIGHT * this.frameY,
        PLAYER_IMAGE_WIDTH,
        PLAYER_IMAGE_HEIGHT,
        0 - this.radius,
        0 - this.radius,
        this.diameter,
        this.diameter
      );
      context.restore();
    }
  },

  update(input, deltaTime, isMuted, scene) {
    const { PLAYER_SPEED, SOUND_ENGINE_FADEOUT } = params;

    // Handle movement
    this.x += this.horizontalSpeed;
    this.y += this.verticalSpeed;

    // Handle movement keys
    if (scene === "gameplay" && this.isAlive) {
      if (input.keys.has("ArrowRight") || input.keys.has("KeyD")) {
        this.horizontalSpeed = PLAYER_SPEED;
      } else if (input.keys.has("ArrowLeft") || input.keys.has("KeyA")) {
        this.horizontalSpeed = -PLAYER_SPEED;
      } else {
        this.horizontalSpeed = 0;
      }
      if (input.keys.has("ArrowUp") || input.keys.has("KeyW")) {
        this.verticalSpeed = -PLAYER_SPEED;
      } else if (input.keys.has("ArrowDown") || input.keys.has("KeyS")) {
        this.verticalSpeed = PLAYER_SPEED;
      } else {
        this.verticalSpeed = 0;
      }
      if (input.keys.has("Shoot")) {
        this.shoot();
        input.keys.delete("Shoot");
      }
    }

    // Handle screen borders
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.gameWidth - this.diameter) {
      this.x = this.gameWidth - this.diameter;
    }
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > this.gameHeight - this.diameter) {
      this.y = this.gameHeight - this.diameter;
    }

    // Handle engine volume and animation
    if (this.horizontalSpeed !== 0 || this.verticalSpeed !== 0) {
      this.soundVolume += SOUND_ENGINE_FADEOUT;
      this.frameY = 1;
    } else {
      this.soundVolume -= SOUND_ENGINE_FADEOUT;
      this.frameY = 0;
    }
    if (this.soundVolume > 1) this.soundVolume = 1;
    if (this.soundVolume < 0) this.soundVolume = 0;
    if (isMuted) this.soundVolume = 0;
    this.sound.volume = this.soundVolume;

    // Handle player animation frame
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX >= this.maxFrame) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  },
};
