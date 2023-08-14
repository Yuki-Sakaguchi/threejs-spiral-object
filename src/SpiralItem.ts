import { Mesh, Object3D } from "three";
import { ITEMS } from "./define";
import { loadedMeshes } from "./loader";

/**
 * 螺旋のアイテムクラス
 */
export default class SpiralItem {
  object!: Object3D; // Object3Dはシーンに追加できる全てのオブジェクトの親
  isPlane = false;

  rotationSpeed = {
    x: 0,
    y: 0,
    z: 0,
  };

  /**
   * 引数のアイテムに合わせてオブジェクトを生成して追加する
   * @param item
   * @param i
   * @param parent
   */
  constructor(
    item: (typeof ITEMS)[number],
    public i: number,
    parent: Object3D
  ) {
    this.initAsModel(item);
    this.object.traverse((v) => (v.userData = { i })); // オブジェクトを判別するためのIDみたいなものを振っておくイメージ
    parent.add(this.object);
  }

  /**
   * 事前に読み込んでおいたモデルからクローンオブジェクトを作る
   * @param item
   */
  initAsModel(item: (typeof ITEMS)[number]) {
    // オブジェクトのクローンを複製
    // これだけだと足りないのでマテリアルは別途複製する
    this.object = loadedMeshes[item.model!].clone();

    // 自身と全ての子要素のマテリアルを複製
    this.object.traverse((v) => {
      const mesh = v as Mesh;
      if (mesh.isMesh && !Array.isArray(mesh.material)) {
        mesh.material = mesh.material.clone();
        mesh.material.transparent = true;
      }
    });

    // サイズと角度を初期設定
    const scaleRate = 0.03;
    this.object.scale.set(scaleRate, scaleRate, scaleRate);
    this.object.rotation.x = Math.PI * 2 * Math.random();
    this.object.rotation.y = Math.PI * 2 * Math.random();
    this.object.rotation.z = Math.PI * 2 * Math.random();
  }

  rotate() {
    this.object.rotation.x += this.rotationSpeed.x;
    this.object.rotation.y += this.rotationSpeed.y;
    this.object.rotation.z += this.rotationSpeed.z;
  }
}
