import { MODELS } from "./define";
import { load } from "./loader";
import renderingSystem from "./RenderingSystem";
import spiralSystem from "./SpiralSystem";

// モデルを読み込んだらループをスタートさせる
Promise.all(MODELS.map((v) => load(v))).then(() => {
  spiralSystem.init();

  let lastTime = 0;
  const loop = (currentTime: number) => {
    const delta = currentTime - lastTime;
    lastTime = currentTime;
    spiralSystem.exec(delta);
    renderingSystem.exec();
    requestAnimationFrame(loop);
  };
  loop(0);
});
