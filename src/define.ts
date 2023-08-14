export const SPIRAL_LOOP = 8;
export const SPIRAL_SPLIT = 8;
export const SPIRAL_OFFSET_Y = 0.1;
export const SPIRAL_OFFSET_ANGLE_RAD = (Math.PI * 2) / SPIRAL_SPLIT;
export const NUM_TOTAL_ITEM = SPIRAL_SPLIT * SPIRAL_LOOP;
export const PLANE_ASPECT = 16 / 9;
export const AUTO_GLOBAL_ROT_SPEED = 0.1;
export const CAMERA_DIST_DEFAULT = 5.5;
export const CAMERA_DIST_ZOOM = 2.87;

export const MODELS = ["dog.glb", "rabit.glb", "rion.glb"];

export const ITEMS = Array(NUM_TOTAL_ITEM)
  .fill(0)
  .map((v, i) => {
    return {
      title: `DummyTitle${i % 3}`,
      model: MODELS[i % 3],
    };
  });
