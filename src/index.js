import Game from "./scripts/logic/game.js";

const mainCanvas = document.getElementById("canvas");
const starCanvas = document.getElementById("starcanvas");
const ctx = mainCanvas.getContext("2d");
const ctxStars = starCanvas.getContext("2d");
setCanvasesSize();

export const game = new Game(window.innerWidth, window.innerHeight, ctx, ctxStars);

window.addEventListener("load", function () {
  document.getElementById("loader").classList.add("hidden");
  game.addStars();
  game.animate(0);
});

window.addEventListener("resize", () => {
  game.windowResize();
  setCanvasesSize();
});

function setCanvasesSize() {
  mainCanvas.width = window.innerWidth;
  mainCanvas.height = window.innerHeight;
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
}
