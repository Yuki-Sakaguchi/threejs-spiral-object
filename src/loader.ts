import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const gltfLoader = new GLTFLoader();

export const loadedMeshes = {} as { [key: string]: Group };

/**
 * モデルの読み込み処理
 * @param file
 */
export const load = async (file: string) => {
  const gltf = await gltfLoader.loadAsync(`./mesh/${file}`);
  loadedMeshes[file] = gltf.scene;
};
