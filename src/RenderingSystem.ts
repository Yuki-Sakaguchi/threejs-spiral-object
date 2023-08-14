import {
  DirectionalLight,
  GridHelper,
  MathUtils,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import {
  CAMERA_DIST_DEFAULT,
  SPIRAL_LOOP,
  SPIRAL_OFFSET_Y,
  SPIRAL_SPLIT,
} from "./define";

/**
 * hfovをvfovに変換する
 * @param hfov
 * @param aspect
 * @returns
 */
function hfov2vfov(hfov: number, aspect: number) {
  return MathUtils.radToDeg(
    Math.atan(Math.tan(MathUtils.degToRad(hfov) / 2) / aspect) * 2
  );
}

/**
 * 描画システムクラス
 */
class RenderingSystem {
  canvas = document.createElement("canvas");

  renderer = new WebGLRenderer({
    canvas: this.canvas,
    antialias: true,
    alpha: true,
  });

  fov = 25;

  camera = new PerspectiveCamera(this.fov);

  scene = new Scene();

  constructor() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x333333);
    this.renderer.setPixelRatio(devicePixelRatio);

    const y = SPIRAL_LOOP * SPIRAL_OFFSET_Y * (SPIRAL_SPLIT / 2); // 螺旋の真ん中の位置を取得
    this.camera.aspect = width / height;
    this.camera.position.set(0, y, CAMERA_DIST_DEFAULT);
    this.camera.lookAt(0, y, 0);
    this.camera.updateProjectionMatrix(); // 変更を反映させる

    // 床のグリッド
    const grid = new GridHelper(100, 100);
    this.scene.add(grid);

    // ライト
    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(10, 20, 20);
    directionalLight.lookAt(0, 0, 0);
    this.scene.add(directionalLight);

    document.body.append(this.canvas);

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    const width = innerWidth;
    const height = innerHeight;
    this.renderer.setSize(width, height);

    const aspect = width / height;
    this.camera.aspect = aspect;
    this.camera.fov = hfov2vfov(this.fov, aspect);
    this.camera.updateProjectionMatrix();
  }

  exec() {
    this.renderer.render(this.scene, this.camera);
  }
}

const renderingSystem = new RenderingSystem();
export default renderingSystem;
