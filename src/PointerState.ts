export default class PointerState {
  down = false; // ボタンが推されているかどうか
  click = false; // クリックされたかどうか
  preventClick = false; // クリックしてから一定時間立っていた時、ポインターアップの時にクリックを発生させない時に使う
  downStartPos = { x: 0, y: 0 }; // ボタンを押した時の座標
  currentPos = { x: 0, y: 0 }; // 現在のポインター座標
  lastPos = { x: 0, y: 0 }; // 前回のループのポインター座標
  deltaPos = { x: 0, y: 0 }; // ポインター座標の変化量

  constructor() {
    const target = document.body;
    target.addEventListener("pointerdown", this.handlePointerdown.bind(this));
    target.addEventListener("pointermove", this.handlePointermove.bind(this));
    target.addEventListener("pointerup", this.handlePointerup.bind(this));
  }

  handlePointerdown(e: PointerEvent) {
    this.currentPos.x = e.clientX;
    this.currentPos.y = e.clientY;
    this.lastPos.x = e.clientX;
    this.lastPos.y = e.clientY;
    if (e.button === 0) {
      this.down = true;
      this.click = false;
      this.preventClick = false;
    }
    Object.assign(this.downStartPos, this.currentPos);
  }

  handlePointermove(e: PointerEvent) {
    this.currentPos.x = e.clientX;
    this.currentPos.y = e.clientY;

    const dist = Math.sqrt(
      (this.currentPos.x - this.downStartPos.x) ** 2 +
        (this.currentPos.y - this.downStartPos.y) ** 2
    );

    // 一定の動きがあればクリックしたことにはしない
    if (dist > 3) this.preventClick = true;
  }

  handlePointerup(e: PointerEvent) {
    this.currentPos.x = e.clientX;
    this.currentPos.y = e.clientY;
    if (e.button === 0) {
      this.down = false;
      if (!this.preventClick) this.click = true;
    }
  }

  update() {
    this.deltaPos.x = this.currentPos.x - this.lastPos.x;
    this.deltaPos.y = this.currentPos.y - this.lastPos.y;
    Object.assign(this.lastPos, this.currentPos);

    this.click = false;
  }
}
