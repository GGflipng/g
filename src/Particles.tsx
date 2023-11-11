import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export default function Particles({
  count,
  color = [1, 1, 1],
  speedFactor = 1,
  scaleFactor = 1,
  waveDifference = 1,
}: {
  count: any;
  color: number[];
  speedFactor: number;
  scaleFactor: number;
  waveDifference: number;
}) {
  const mouse = useRef([0, 0]);

  const mesh = useRef<any>();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 1000;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 2000;
      const xFactor = -5 + Math.random() * 7;
      const yFactor = -5 + Math.random() * 7;
      const zFactor = -5 + Math.random() * 7;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    particles.forEach((particle, i) => {
      // eslint-disable-next-line prefer-const
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += (speed * speedFactor) / 4;
      const a = (Math.cos(t) + Math.sin(t * 1) / 10) * waveDifference;
      const b = (Math.sin(t) + Math.cos(t * 2) / 10) * waveDifference;
      const s = Math.cos(t);
      particle.mx += (mouse.current[0] - particle.mx) * 0.01;
      particle.my += (mouse.current[1] * -1 - particle.my) * 0.01;
      // Update the dummy object
      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s * scaleFactor, s * scaleFactor, s * scaleFactor);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      // And apply the matrix to the instanced item
      (mesh.current as any).setMatrixAt(i, dummy.matrix);
    });
    (mesh.current as any).instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh
        position={[0, 1, 0]}
        scale={0.3}
        ref={mesh}
        args={[undefined, undefined, count]}
      >
        <dodecahedronGeometry args={[0.1, 0]} />
        <meshPhongMaterial
          color={new THREE.Color(color[0], color[1], color[2])}
        />
      </instancedMesh>
    </>
  );
}
