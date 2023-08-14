import SpiralItem from "./SpiralItem";
import {
  AUTO_GLOBAL_ROT_SPEED,
  CAMERA_DIST_DEFAULT,
  CAMERA_DIST_ZOOM,
  ITEMS,
  SPIRAL_LOOP,
  SPIRAL_OFFSET_ANGLE_RAD,
  SPIRAL_OFFSET_Y,
  SPIRAL_SPLIT,
} from "./define";
import renderingSystem from "./RenderingSystem";
import { Raycaster, Vector3 } from "three";
import PointerState from "./PointerState";

/**
 * 螺旋システムクラス
 */
class SpiralSystem {
  items!: SpiralItem[];
  spiralRot = 0;
  spiralYByScroll = 0;
  spiralVelocity = { rot: 0, y: 0 };
  pointerState = new PointerState();
  raycaster = new Raycaster();

  // フォーカス系の変数
  focusTargetIndex = -1; // フォーカス中のアイテムのID
  isInFocus = false;
  opacity = 1;
  cameraDist = CAMERA_DIST_DEFAULT;

  init() {
    this.items = ITEMS.map(
      (v, i) => new SpiralItem(v, i, renderingSystem.scene)
    );
  }

  /**
   * アイテムの位置を計算する
   * @param i
   * @param position
   */
  calcItemPosition(
    i: number,
    spiralRot: number,
    spiralY: number,
    position: Vector3
  ) {
    const itemRot = SPIRAL_OFFSET_ANGLE_RAD * i + spiralRot;
    const x = Math.sin(itemRot) / 1.5;
    const z = Math.cos(itemRot) / 1.5;

    // 無限ループさせるために位置を計算する
    let y = SPIRAL_OFFSET_Y * i + spiralY;
    y %= SPIRAL_OFFSET_Y * SPIRAL_SPLIT * SPIRAL_LOOP;
    if (y < 0) y += SPIRAL_OFFSET_Y * SPIRAL_SPLIT * SPIRAL_LOOP;

    position.set(x, y, z);
  }

  /**
   * アイテムの回転した際の位置を計算する
   * @param delta
   */
  calcSpiralPositionAndRotation(delta: number) {
    if (this.pointerState.down) {
      // マウスが押されていたらマウスポインターの移動距離に合わせて速度を出して反映する
      this.spiralVelocity.rot = this.pointerState.deltaPos.x * 0.08;
      this.spiralVelocity.y = this.pointerState.deltaPos.y * 0.08 * -1; // 上下を反転するためにマイナスをかける
      this.spiralRot += this.spiralVelocity.rot;
      this.spiralYByScroll += this.spiralVelocity.y;
    } else {
      // マウスが押されてなかったら徐々に減衰させながら元の速度に戻す
      this.spiralRot += (delta / 1000) * AUTO_GLOBAL_ROT_SPEED;
      this.spiralRot += this.spiralVelocity.rot;
      this.spiralYByScroll += this.spiralVelocity.y;

      // 速度を減衰させる
      this.spiralVelocity.rot *= 0.95;
      this.spiralVelocity.y *= 0.95;
    }
  }

  /**
   * PointerEventは左上が(0,0)、右下が(window.innerWidth, window.innerHeight)
   * Raycasterは右上が（1,1)で左下が(-1,-1)になるので変換が必要
   */
  getPointedObj() {
    const rayFrom = {
      x: (this.pointerState.currentPos.x / innerWidth) * 2 - 1,
      y: (this.pointerState.currentPos.y / innerHeight) * 2 - 1,
    };
    this.raycaster.setFromCamera(rayFrom, renderingSystem.camera);

    const objs = this.items.map((v) => v.object);
    const intersected = this.raycaster.intersectObjects(objs);
    return intersected[0];
  }

  focusItem(i: number) {
    console.log(i);
  }

  exec(delta: number) {
    const rotRate = this.spiralRot / (Math.PI * 2);
    const spiralYByRot = rotRate * SPIRAL_SPLIT * SPIRAL_OFFSET_Y;
    const spiralY = this.spiralYByScroll + spiralYByRot;

    if (!this.isInFocus) this.calcSpiralPositionAndRotation(delta);

    this.items.forEach((v, i) => {
      this.calcItemPosition(i, this.spiralRot, spiralY, v.object.position);
      v.rotate();
    });

    if (this.pointerState.click && !this.isInFocus) {
      const t = this.getPointedObj();
      if (t) this.focusItem(t.object.userData.i);
    }

    this.pointerState.update();
  }
}

const spiralSystem = new SpiralSystem();
export default spiralSystem;
