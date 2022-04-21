import Player from "../entities/player.js";
import InputHandler from "./inputHandler.js";
import Asteroid from "../entities/asteroid.js";
import Particle from "../entities/particle.js";
import Projectile from "../entities/projectile.js";
import ScoreInfo from "../entities/scoreInfo.js";
import Star from "../entities/star.js";
import StartScreen from "../entities/startScreen.js";
import GameoverText from "../entities/gameoverText.js";
import MuteIcon from "../entities/muteIcon.js";
import PauseText from "../entities/pauseText.js";
import { params } from "./params.js";
import { getRandom, getRandomInt, soundPlay, getHalfChance } from "./utils.js";

export default function Game(gameWidth, gameHeight, context, contextStars) {
  this.scene = "menu";
  this.gameWidth = gameWidth;
  this.gameHeight = gameHeight;
  this.context = context;
  this.contextStars = contextStars;
  this.score = 0;
  this.bestScore = localStorage.getItem("bestScore") ?? 0;
  this.isMuted = !!JSON.parse(localStorage.getItem("isMuted"));
  this.isPaused = false;
  this.projectiles = [];
  this.asteroids = [];
  this.particles = [];
  this.stars = [];
  this.explosion = [];
  this.player = new Player(this.gameWidth, this.gameHeight, params.PLAYER_RADIUS, this.addProjectile.bind(this));
  this.startScreen = new StartScreen(this.gameWidth, this.gameHeight, this.bestScore);
  this.gameoverText = new GameoverText(this.gameWidth, this.gameHeight);
  this.input = new InputHandler(this.player.setAngle.bind(this.player), this.setPause.bind(this), this.setMute.bind(this));
  this.scoreInfo = new ScoreInfo(this.gameWidth, this.gameHeight, this.score);
  this.muteIcon = new MuteIcon(this.gameWidth, this.gameHeight);
  this.pauseText = new PauseText();
  this.lastTime = 0;
  this.animationId;
  this.asteroidTimer = 0;
  this.crashSoundTimer = 0;
  this.permissionToPlayCrashSound = true;
}

Game.prototype = {
  init() {
    this.scene = "gameplay";
    this.projectiles = [];
    this.asteroids = [];
    this.particles = [];
    this.explosion = [];
    this.player.init();
    this.input.keys.delete("Shoot");
    this.score = 0;
    this.lastTime = 0;
    this.asteroidTimer = 0;
    this.crashSoundTimer = 0;
    this.permissionToPlayCrashSound = true;
  },

  windowResize() {
    const gameWidth = window.innerWidth;
    const gameHeight = window.innerHeight;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.player.gameWidth = gameWidth;
    this.player.gameHeight = gameHeight;
    this.scoreInfo.gameWidth = gameWidth;
    this.scoreInfo.gameHeight = gameHeight;
    this.muteIcon.gameWidth = gameWidth;
    this.muteIcon.gameHeight = gameHeight;
    this.startScreen.gameWidth = gameWidth;
    this.startScreen.gameHeight = gameHeight;
    this.gameoverText.gameWidth = gameWidth;
    this.gameoverText.gameHeight = gameHeight;
    this.stars = [];
    this.addStars();
  },

  // Handle Start and Restart keys
  handleKeys() {
    if (this.input.keys.has("Space")) {
      if (this.scene === "menu") {
        this.scene = "gameplay";
        this.player.sound.play();
      } else if (this.scene === "gameplay" && !this.player.isAlive) {
        this.init();
      }
      this.input.keys.delete("Space");
    }
  },

  setPause() {
    if (this.scene === "gameplay" && this.player.isAlive) {
      if (!this.isPaused) {
        this.isPaused = true;
        this.pauseText.draw(this.context, this.gameWidth, this.gameHeight);
        cancelAnimationFrame(this.animationId);
      } else {
        this.isPaused = false;
        this.animate(0);
      }
    }
  },

  setMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("isMuted", this.isMuted);
  },

  setScene(scene) {
    this.scene = scene;
  },

  addStars() {
    for (let i = 0; i <= params.STARS_COUNT; i++) {
      this.stars.push(new Star(this.gameWidth, this.gameHeight));
    }
  },

  addProjectile(projectileX, projectileY, velocity) {
    this.projectiles.push(new Projectile(projectileX, projectileY, velocity, this.isMuted));
  },

  // Create new asteroid by timer
  addNewAsteroid(deltaTime) {
    let x;
    let y;
    const color = {
      hue: getRandomInt(0, 360),
      saturation: getRandomInt(0, 100),
      brightness: getRandomInt(70, 100),
    };
    const { ASTEROIDS_INTERVAL, ASTEROID_FULLSIZE } = params;

    if (this.asteroidTimer > ASTEROIDS_INTERVAL) {
      if (getHalfChance()) {
        x = getHalfChance() ? 0 - ASTEROID_FULLSIZE : this.gameWidth + ASTEROID_FULLSIZE;
        y = getRandom(0, this.gameHeight);
      } else {
        x = getRandom(0, this.gameWidth);
        y = getHalfChance() ? 0 - ASTEROID_FULLSIZE : this.gameHeight + ASTEROID_FULLSIZE;
      }
      const speed = Math.random() * this.calculateAsteroidSpeedMult(ASTEROID_FULLSIZE);
      const velocity = {
        x: x < 0 ? speed : -speed,
        y: y < 0 ? speed : -speed,
      };
      this.asteroids.push(new Asteroid(x, y, velocity, color, ASTEROID_FULLSIZE));
      this.asteroidTimer = 0;
    } else {
      this.asteroidTimer += deltaTime;
    }
  },

  addBrokenAsteroids(x, y, color, size, quantity) {
    if (this.asteroids.length < params.LIMIT_ASTEROIDS) {
      for (let i = 1; i <= quantity; i++) {
        const speedX = (Math.random() - 0.5) * this.calculateAsteroidSpeedMult(size);
        const speedY = (Math.random() - 0.5) * this.calculateAsteroidSpeedMult(size);
        const velocity = {
          x: speedX,
          y: speedY,
        };
        this.asteroids.push(new Asteroid(x, y, velocity, color, size));
      }
    }
  },

  calculateAsteroidSpeedMult(size) {
    const { ASTEROID_SPEED_MULTIPLIER, ASTEROID_INITIAL_SPEED, ASTEROID_SPEED_TO_SIZE_VARIABILITY } = params;
    return (this.score * ASTEROID_SPEED_MULTIPLIER + ASTEROID_INITIAL_SPEED) / (size / ASTEROID_SPEED_TO_SIZE_VARIABILITY);
  },

  asteroidBrake(asteroid) {
    const { PARTICLES_SIZE_RATIO, DEBRIS_COUNT_FULLSIZE, ASTEROID_HALFSIZE, DEBRIS_COUNT_HALFSIZE, ASTEROID_MINSIZE } = params;

    if (this.permissionToPlayCrashSound === true && !this.isMuted) {
      asteroid.sound.play();
      this.permissionToPlayCrashSound = false;
      this.crashSoundTimer = 0;
    }

    asteroid.markedForDeletion = true;
    const particleRadius = asteroid.initialSize * PARTICLES_SIZE_RATIO;
    let debrisCount;
    let debrisSize;

    switch (asteroid.initialSize) {
      case params.ASTEROID_FULLSIZE:
        debrisCount = DEBRIS_COUNT_FULLSIZE;
        debrisSize = ASTEROID_HALFSIZE;
        break;
      case params.ASTEROID_HALFSIZE:
        debrisCount = DEBRIS_COUNT_HALFSIZE;
        debrisSize = ASTEROID_MINSIZE;
        break;
      default:
        debrisCount = 0;
        break;
    }
    this.createParticles(asteroid.x, asteroid.y, asteroid.color, particleRadius);
    if (debrisCount) this.addBrokenAsteroids(asteroid.x, asteroid.y, asteroid.color, debrisSize, debrisCount);
  },

  createParticles(x, y, color, size) {
    const { LIMIT_PARTICLES, PARTICLES_COUNT } = params;

    if (this.particles.length < LIMIT_PARTICLES) {
      for (let i = 0; i <= PARTICLES_COUNT; i++) {
        const velocity = {
          x: (Math.random() - 0.5) * (Math.random() * 10),
          y: (Math.random() - 0.5) * (Math.random() * 10),
        };
        this.particles.push(new Particle(x, y, velocity, color, size));
      }
    }
  },

  // Collisions between asteroids and player
  collisionWithPlayer(asteroid) {
    if (this.player.isAlive) {
      const distX = this.player.x + this.player.radius - asteroid.x;
      const distY = this.player.y + this.player.radius - asteroid.y;
      const dist = Math.hypot(distX, distY);
      if (dist - asteroid.radius - this.player.radius < 1) {
        this.player.die(this.explosion, this.isMuted);
      }
    }
  },

  // Collisions between asteroids and projectiles
  collisionWithProjectiles(asteroid) {
    this.projectiles.forEach((projectile) => {
      const dist = Math.hypot(projectile.x - asteroid.x, projectile.y - asteroid.y);
      if (dist - asteroid.radius < 1) {
        projectile.markedForDeletion = true;
        soundPlay(projectile.soundExplode, this.isMuted);
        this.asteroidBrake(asteroid);

        let addScore;
        const { ASTEROID_FULLSIZE, SCORE_FULLSIZE, ASTEROID_HALFSIZE, SCORE_HALFSIZE, SCORE_MINSIZE} = params;

        switch (asteroid.initialSize) {
          case ASTEROID_FULLSIZE:
            addScore = SCORE_FULLSIZE;
            break;
          case ASTEROID_HALFSIZE:
            addScore = SCORE_HALFSIZE;
            break;
          default:
            addScore = SCORE_MINSIZE;
            break;
        }
        this.score += addScore;
      }
    });
  },

  // Collisions between two asteroids
  collisionWithAsteroids(asteroid, i) {
    for (let j = i + 1; j < this.asteroids.length; j++) {
      let secondAsteroid = this.asteroids[j];
      if (
            asteroid.color !== secondAsteroid.color &&
            (asteroid.x > 0 || asteroid.x < this.gameWidth) &&
            (asteroid.y > 0 || asteroid.y < this.gameHeight)
          ) {
            const dist = Math.hypot(secondAsteroid.x - asteroid.x, secondAsteroid.y - asteroid.y);
            if (dist - asteroid.radius - secondAsteroid.radius < 1) {
              this.asteroidBrake(asteroid);
              this.asteroidBrake(secondAsteroid);
            }
          }
    }
    // this.asteroids.forEach((secondAsteroid) => {
    //   if (
    //     asteroid !== secondAsteroid &&
    //     asteroid.color !== secondAsteroid.color &&
    //     (asteroid.x > 0 || asteroid.x < this.gameWidth) &&
    //     (asteroid.y > 0 || asteroid.y < this.gameHeight)
    //   ) {
    //     const dist = Math.hypot(secondAsteroid.x - asteroid.x, secondAsteroid.y - asteroid.y);
    //     if (dist - asteroid.radius - secondAsteroid.radius < 1) {
    //       this.asteroidBrake(asteroid);
    //       this.asteroidBrake(secondAsteroid);
    //     }
    //   }
    // });
  },

  gameplay(deltaTime) {
    // Handle crash sounds interval
    if (this.crashSoundTimer > params.CRASH_SOUND_INTERVAL) {
      this.permissionToPlayCrashSound = true;
      this.crashSoundTimer = 0;
    } else {
      this.crashSoundTimer += deltaTime;
    }

    // Handle projectiles
    this.projectiles.forEach((projectile) => {
      projectile.update(this.gameWidth, this.gameHeight);
      projectile.draw(this.context);
    });

    // Handle player
    this.player.draw(this.context);
    this.player.update(this.input, deltaTime, this.isMuted, this.scene);

    // Handle asteroids
    this.addNewAsteroid(deltaTime);
    for (let i = 0; i < this.asteroids.length; i++) {
      const asteroid = this.asteroids[i];
      asteroid.update(this.gameWidth, this.gameHeight);
      asteroid.draw(this.context);
      this.collisionWithPlayer(asteroid);
      this.collisionWithProjectiles(asteroid);
      if ((asteroid.x > 0 || asteroid.x < this.gameWidth) && (asteroid.y > 0 || asteroid.y < this.gameHeight)) {
        this.collisionWithAsteroids(asteroid, i);
      }
    }
    // this.asteroids.forEach((asteroid) => {
    //   asteroid.update(this.gameWidth, this.gameHeight);
    //   asteroid.draw(this.context);
    //   this.collisionWithPlayer(asteroid);
    //   this.collisionWithProjectiles(asteroid);
    //   if ((asteroid.x > 0 || asteroid.x < this.gameWidth) && (asteroid.y > 0 || asteroid.y < this.gameHeight)) {
    //     this.collisionWithAsteroids(asteroid);
    //   }
    // });

    // Handle particles
    this.particles.forEach((particle) => {
      particle.update();
      particle.draw(this.context);
    });

    // Remove objects that left the screen and dead objects
    this.projectiles = this.projectiles.filter((projectile) => !projectile.markedForDeletion);
    this.asteroids = this.asteroids.filter((asteroid) => !asteroid.markedForDeletion);
    this.particles = this.particles.filter((particle) => !particle.markedForDeletion);
  },

  drawMenuScene() {
    this.startScreen.draw(this.context);
  },

  drawGameOverText() {
    this.gameoverText.draw(this.context, this.score, this.bestScore);
  },

  // Main animation loop
  animate(timeStamp) {
    const deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    this.animationId = window.requestAnimationFrame(this.animate.bind(this));

    // Clear canvases
    this.context.clearRect(0, 0, this.gameWidth, this.gameHeight);
    this.contextStars.fillStyle = "rgba(0, 0, 0, 0.1)";
    this.contextStars.fillRect(0, 0, this.gameWidth, this.gameHeight);

    // Handle stars
    this.stars.forEach((star) => {
      star.draw(this.contextStars, deltaTime);
    });

    this.handleKeys();

    if (this.scene === "menu") {
      this.drawMenuScene();
    }
    if (this.scene === "gameplay") {
      this.gameplay(deltaTime);
      if (!this.player.isAlive) {
        this.explosion[0].draw(this.context, this.player.x + this.player.radius, this.player.y + this.player.radius);
        this.explosion[0].update(deltaTime);
        this.drawGameOverText();
      } else {
        this.scoreInfo.draw(this.context);
        this.scoreInfo.update(this.score);
      }
    }

    // Handle muteIcon
    this.muteIcon.draw(this.context);
    this.muteIcon.update(this.isMuted);
  },
};
