import { MODELS } from "./define";
import { load } from "./loader";
import renderingSystem from "./RenderingSystem";

// モデルを読み込んだらループをスタートさせる
Promise.all(MODELS.map((v) => load(v))).then(() => {
  let lastTime = 0;
  const loop = (currentTime: number) => {
    const delta = currentTime - lastTime;
    lastTime = currentTime;
    renderingSystem.exec();
    requestAnimationFrame(loop);
  };
  loop(0);
});
