import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { randomNumber } from "./util";

interface IParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  speed: number;
  rotationAxis: THREE.Vector3;
  scale: THREE.Vector3;
}

const ParticlesTowardsCamera = ({ color }: { color: any }) => {
  const particleCount = 1000;

  const particles: IParticle[] = useMemo(() => {
    const temp: IParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle: IParticle = {
        position: new THREE.Vector3(0, -15, 12),
        velocity: new THREE.Vector3(0, 0, 1),
        speed: Math.random() * 200,
        rotationAxis: new THREE.Vector3(
          (Math.random() + 1) * 2,
          (Math.random() + 1) * 2,
          (Math.random() + 1) * 2
        ),
        scale: new THREE.Vector3(1, 1, 1),
      };
      temp.push(particle);
    }
    return temp;
  }, []);

  const meshRef = useRef<any>();

  useFrame((state, delta) => {
    const { camera } = state;

    particles.forEach((particle, index) => {
      const direction = new THREE.Vector3();
      direction.subVectors(camera.position, particle.position).normalize();

      const rotationAxis = particle.rotationAxis;
      const angularVelocity = new THREE.Vector3();
      angularVelocity.crossVectors(direction, rotationAxis).normalize();

      particle.velocity.copy(direction).multiplyScalar(particle.speed);
      const rotationSpeed = Math.random() * 20;
      particle.velocity.addScaledVector(angularVelocity, rotationSpeed);

      particle.position.addScaledVector(particle.velocity, delta);

      if (particle.position.z > camera.position.z) {
        const flip = Math.random() > 0.5;

        particles[index].rotationAxis = new THREE.Vector3(
          flip
            ? (Math.random() + 1) * randomNumber(2, 4)
            : (Math.random() + 1) * randomNumber(2, 4) * -1,
          flip ? (Math.random() + 1) * 20 : (Math.random() + 1) * 20 * -1,
          flip ? (Math.random() + 1) * 5 : (Math.random() + 1) * 5 * -1
        );
        particles[index].speed = (Math.random() * 200) / randomNumber(1, 2);
        particle.position.set(0, -15, -12);
        const scaleFactor = Math.random() * 3 + 0.1;
        particle.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }

      const matrix = new THREE.Matrix4();
      matrix.setPosition(particle.position);
      matrix.scale(particle.scale);
      meshRef.current.setMatrixAt(index, matrix);
    });

    if (meshRef && meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <dodecahedronGeometry args={[0.02, 0]} />
      <meshPhongMaterial color={color} />
    </instancedMesh>
  );
};

export default ParticlesTowardsCamera;
