export function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function soundPlay(sound, isMuted) {
  if (!isMuted) sound.play();
}

export function getHalfChance() {
  return Math.random() < 0.5;
}