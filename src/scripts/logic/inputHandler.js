import { params } from "./params.js";

export default function InputHandler(setAngle, setPause, setMute) {
  this.setAngle = setAngle;
  this.setPause = setPause;
  this.setMute = setMute;
  this.keys = new Set();

  window.addEventListener("keydown", (e) => {
    const { code } = e;
    if (params.CONTROL_KEYS.includes(code)) {
      e.preventDefault();
      this.keys.add(code);
    }
  });

  window.addEventListener("keyup", (e) => {
    this.keys.delete(e.code);
  });

  window.addEventListener("click", (e) => {
    this.keys.add("Shoot");
  });

  window.addEventListener("mousemove", (e) => {
    const { CROSSHAIR_CORRECTION } = params;
    const cursorX = e.clientX - CROSSHAIR_CORRECTION;
    const cursorY = e.clientY - CROSSHAIR_CORRECTION;
    this.setAngle(cursorX, cursorY);
  });

  window.addEventListener("keypress", (e) => {
    const { code } = e;
    if (code === "KeyP") {
      this.setPause();
    } else if (code === "KeyM") {
      this.setMute();
    }
  });
}
