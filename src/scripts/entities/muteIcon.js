import { params } from "../logic/params.js";

export default function MuteIcon(gameWidth, gameHeight) {
  this.gameWidth = gameWidth;
  this.gameHeight = gameHeight;
  this.image = document.getElementById("muteImage");
  this.frameX = 0;
  this.iconWidth = params.MUTE_ICON_WIDTH;
  this.iconHeight = this.iconWidth * (this.gameHeight / this.gameWidth);
}

MuteIcon.prototype = {
  update(isMuted) {
    this.frameX = isMuted ? 1 : 0;
  },

  draw(context) {
    const {MUTE_IMAGE_WIDTH, MUTE_IMAGE_HEIGHT, HUD_HORIZONTAL_OFFSET, HUD_VERTICAL_ICON_OFFSET} = params;

    context.drawImage(
      this.image,
      MUTE_IMAGE_WIDTH * this.frameX,
      0,
      MUTE_IMAGE_WIDTH,
      MUTE_IMAGE_HEIGHT,
      this.gameWidth - this.iconWidth - HUD_HORIZONTAL_OFFSET,
      HUD_VERTICAL_ICON_OFFSET,
      this.iconWidth,
      this.iconHeight
    );
  },
};
