import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useMemo } from "react";

export default function Coin() {
  const { materials, scene } = useLoader(GLTFLoader, "./gcoin.gltf"); // load the model

  useMemo(() => {
    for (const material in materials) {
      // iterate the materials
      if (Object.prototype.hasOwnProperty.call(materials, material)) {
        // change the color of all the materials (there's only one in this model)
        // materials[material].color.set("#bb6f3e");
        // you can also change the color of a specific material if you know the name of the material
      }
    }
  }, [materials]);

  // return the primitive with our scene and changed materials
  return <primitive object={scene} />;
}
