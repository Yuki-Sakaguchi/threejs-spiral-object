/**
 * ホイルール操作をまとめるクラス
 */
export default class WheelState {
  wheelTimer?: number = undefined;
  wheelDelta = { x: 0, y: 0 };

  constructor() {
    const target = document.body;
    target.addEventListener("wheel", this.handleWheel.bind(this));
  }

  handleWheel(e: WheelEvent) {
    if (!this.wheelTimer) {
      console.log("start wheel");
    }
    clearTimeout(this.wheelTimer);
    this.wheelTimer = setTimeout(() => {
      console.log("stop wheel");
      this.wheelTimer = undefined;
      this.wheelDelta.x = 0;
      this.wheelDelta.y = 0;
    }, 250);

    this.wheelDelta.x += e.deltaX;
    this.wheelDelta.y += e.deltaY;
    console.log("move wheel", this.wheelDelta);
  }
}
