import {
  Cloud,
  Clouds,
  MeshReflectorMaterial,
  Shadow,
  Sparkles,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef, useState } from "react";
import { Color, Mesh, PointLight } from "three";

import { Vector3 } from "three/src/math/Vector3.js";
import Coin from "./Coin";
import Particles from "./Particles";
import * as GameState from "./GameState";
import { useAtom } from "jotai";

import { useSpring } from "@react-spring/three";
import ParticlesTowardsCamera from "./ParticlesTowardsCamera";

function App() {
  return (
    <>
      <Canvas
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 3, 100], fov: 5, near: 1, far: 600 }}
      >
        <Sparkles
          color={new Color(0.5, 0.95, 0.5)}
          count={200}
          scale={[20, 20, 20]}
          size={6}
          speed={1}
          opacity={0.5}
        />
        <color attach="background" args={["black"]} />
        <fog attach="fog" args={["black", 100, 250]} />
        <ambientLight intensity={0.1} />
        <directionalLight intensity={10} position={[0, 3, 100]} color="white" />

        <CoinMesh />

        <Shadow
          color={new Color(0.25, 0.5, 0.25)}
          colorStop={0.1}
          opacity={0.01}
          fog={false} // Reacts to fog (default=false)
          position={[0, -0.99, 0.6]}
          scale={10}
        />

        <Particles
          waveDifference={1}
          scaleFactor={1}
          speedFactor={0.5}
          count={15}
          color={[1, 1, 1]}
        />
        <Particles
          waveDifference={1}
          scaleFactor={1}
          speedFactor={0.1}
          count={10}
          color={[0.1, 0.6, 0.5]}
        />

        <Particles
          waveDifference={0}
          scaleFactor={2}
          speedFactor={1}
          count={8}
          color={[0.9, 0.9, 0]}
        />

        {/* <Clouds limit={100}> */}
        <pointLight
          power={500}
          position={[0, 1.6, 0]}
          color={new Color(0.1, 0.05, 0)}
        />

        <pointLight
          power={10000}
          position={[0, 500, 0]}
          color={new Color(0.7, 0.7, 0)}
        />

        <Clouds texture={"/cloud.png"}>
          <Cloud
            position={[0, 450, 0]}
            seed={1}
            speed={0.1}
            growth={2}
            segments={100}
            volume={20}
            opacity={1}
            bounds={[10, 20, 20]}
            color={[1, 1, 1]}
          />
        </Clouds>

        <EffectComposer disableNormalPass multisampling={8}>
          <Bloom
            luminanceThreshold={0.2}
            mipmapBlur
            luminanceSmoothing={0.9}
            intensity={0.2}
          />
        </EffectComposer>
        <Suspense fallback={null}>
          <Ground />

          <Camera />
        </Suspense>
      </Canvas>
    </>
  );
}

function CoinMesh() {
  const [isFlipButtonHovered] = useAtom(GameState.isFlipButtonHovered);

  const [soundEnabled] = useAtom(GameState.soundEnabled);

  const ref = useRef<any>();
  const pointLightref = useRef<PointLight | null>(null);
  const [flipResult, setFlipResult] = useState(true);

  const [, setCameraPosition] = useAtom(GameState.cameraPosition);

  const [flipButtonDisabled, setIsFlipButtonDisabled] = useAtom(
    GameState.isFlipButtonDisabled
  );

  const [isCoinFlippingAnimationFrame, setIsCoinFlippingAnimationFrame] =
    useAtom(GameState.isCoinFlippingAnimation);

  const [coinY, setCoinY] = useAtom(GameState.coinY);

  const [{ animationFrame }] = useSpring(
    {
      animationFrame: isCoinFlippingAnimationFrame,
      config: {
        mass: 50,
        tension: 500,
        friction: 5,
        precision: 0.00001,
        duration: [
          1000, 950, 1500, 200, 1000, 2000, 1000, 3000, 2000, 0, 1000, 1000,
          2000,
        ][isCoinFlippingAnimationFrame],
      },
      onStart() {
        if (isCoinFlippingAnimationFrame === 4) {
          setCameraPosition(1);
        }
      },
      onResolve(result) {
        if (!result.finished) {
          return;
        }

        if (isCoinFlippingAnimationFrame === 1) {
          setIsCoinFlippingAnimationFrame(2);
          playWarmUpWebPlayer();
          return;
        }

        if (isCoinFlippingAnimationFrame === 2) {
          setIsCoinFlippingAnimationFrame(3);
          if (soundEnabled) {
            playFlip();
            playWhosh();
          }
          return;
        }

        if (isCoinFlippingAnimationFrame === 3) {
          if (soundEnabled) {
            playSoftWind();
          }
          setIsCoinFlippingAnimationFrame(4);
          return;
        }

        if (isCoinFlippingAnimationFrame === 4) {
          setIsCoinFlippingAnimationFrame(5);

          return;
        }

        if (isCoinFlippingAnimationFrame === 5) {
          setIsCoinFlippingAnimationFrame(6);
          return;
        }

        if (isCoinFlippingAnimationFrame === 6) {
          setIsCoinFlippingAnimationFrame(7);
          if (soundEnabled) {
            playAnticipation();
          }
          return;
        }

        if (isCoinFlippingAnimationFrame === 7) {
          setIsCoinFlippingAnimationFrame(8);
          setCameraPosition(0);
          return;
        }

        if (isCoinFlippingAnimationFrame === 8) {
          setIsCoinFlippingAnimationFrame(9);
          const flipRes = Math.random() > 0.5;
          setFlipResult(flipRes);
          if (flipRes && soundEnabled) {
            playGameWin();
          }
          return;
        }

        if (isCoinFlippingAnimationFrame === 9) {
          setIsCoinFlippingAnimationFrame(10);
          setCameraPosition(2);
          return;
        }

        if (isCoinFlippingAnimationFrame === 10) {
          setIsCoinFlippingAnimationFrame(11);
          return;
        }
      },
    },
    [isCoinFlippingAnimationFrame]
  );

  const [{ x }] = useSpring(
    {
      x: isFlipButtonHovered || flipButtonDisabled ? 1 : 0,
      config: {
        mass: 50,
        tension: 1000,
        friction: 500,
        precision: 0.0001,
        duration: 750,
      },
    },
    [isFlipButtonHovered]
  );

  const flipGround = {
    rx: 1.576,
    ry: 0,
    rz: 0,
    y: -0.9,
  };

  const [lightState, setLightState] = useState(0);

  const [{ lightPowerSpring }] = useSpring(
    {
      lightPowerSpring:
        isCoinFlippingAnimationFrame === 10 ||
        isCoinFlippingAnimationFrame === 11
          ? 1
          : 0,
      config: {
        mass: 50,
        tension: 1000,
        friction: 500,
        precision: 0.0001,
        duration: 1000,
      },
    },
    [isCoinFlippingAnimationFrame]
  );

  const [{ lightColorSpring }] = useSpring(
    {
      lightColorSpring: flipResult ? 1 : 0,
      config: {
        mass: 50,
        tension: 1000,
        friction: 500,
        precision: 0.0001,
        duration: 2000,
      },
    },
    [flipResult, isCoinFlippingAnimationFrame]
  );

  useEffect(() => {
    if (
      isCoinFlippingAnimationFrame === 10 ||
      isCoinFlippingAnimationFrame === 11
    ) {
      lightColorSpring.set(!flipResult ? 1 : 0); // to update again
      setLightState(1);
    } else {
      setLightState(0);
    }
  }, [flipResult, isCoinFlippingAnimationFrame]);

  useFrame((_, delta) => {
    if (pointLightref.current) {
      switch (lightState) {
        case 0:
          pointLightref.current.power = 0;
          break;

        default:
          pointLightref.current.power = lightPowerSpring
            .to([1, 0], [7000, 1700000])
            .get();

          pointLightref.current.color = new Color(
            lightColorSpring.to([0, 1], [0.4, 1]).get(),
            lightColorSpring.to([0, 1], [0.3, 0.05]).get(),
            0
          );
          break;
      }
    }

    if (ref.current) {
      const refme = ref.current as Mesh;
      if (coinY !== refme.position.y) {
        setCoinY(refme.position.y);
      }

      if (isCoinFlippingAnimationFrame === 11 && isFlipButtonHovered) {
        setCameraPosition(0);
        setIsFlipButtonDisabled(false);
        setIsCoinFlippingAnimationFrame(0);
        return;
      }

      if (isCoinFlippingAnimationFrame === 0 && flipButtonDisabled) {
        animationFrame.set(1);
        setIsCoinFlippingAnimationFrame(1);
        return;
      }

      switch (isCoinFlippingAnimationFrame) {
        case 0:
          refme.rotation.y += -delta * x.to([0, 1], [0.1, 10]).get();
          refme.rotation.z += delta * x.to([0, 1], [0.2, 1.1]).get();
          refme.position.y = x.to([0, 1], [0, 0.4]).get();

          refme.rotation.x += delta * 2;
          break;

        case 9:
          refme.rotation.x = 0;
          refme.rotation.y = 0;
          refme.rotation.z = 0;

          refme.position.y = 0;
          break;

        case 10:
        case 11:
          refme.rotation.x = flipGround.rx * (flipResult ? 3 : 1);
          refme.rotation.y = flipGround.ry;
          refme.rotation.z = flipGround.rz;

          refme.position.y = flipGround.y;
          break;

        default:
          refme.rotation.x +=
            delta *
            animationFrame
              .to(
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                [2, 2, 10, 2, 0.2, 0.1, 0.05, 0.05, 4, 0]
              )
              .get();

          refme.rotation.y +=
            -delta *
            animationFrame
              .to(
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                [10, 20, 80, 40, 0.5, 0.25, 0.125, 20, 3, 0]
              )
              .get();
          refme.rotation.z +=
            delta *
            animationFrame
              .to(
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1.1, 10, 30, 30, 0.2, 0.1, 0.05, 4, 4, 0]
              )
              .get();

          refme.position.y = animationFrame
            .to(
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
              [0.4, 0.4, 0.4, 15, 430, 495, 490, 430, 0.4, 0]
            )
            .get();

          break;
      }
    }
  });

  function playWarmUpWebPlayer() {
    new Audio(`${location.href}/nada.mp3`).play();
  }

  function playSoftWind() {
    new Audio(`${location.href}/soft-wind.mp3`).play();
  }

  function playGameWin() {
    new Audio(`${location.href}/game-win.mp3`).play();
  }

  function playAnticipation() {
    new Audio(`${location.href}/drop.mp3`).play();
  }

  function playFlip() {
    new Audio(`${location.href}/coin-flip.mp3`).play();
  }

  function playWhosh() {
    new Audio(`${location.href}/whoosh.mp3`).play();
  }

  return (
    <>
      <mesh ref={ref} scale={1} position={[0, 0, 0]}>
        <Coin />
      </mesh>

      <pointLight ref={pointLightref} power={7000} position={[0, 6, 0]} />
      {isFlipButtonHovered ? (
        <Particles
          waveDifference={0}
          scaleFactor={0.2}
          speedFactor={2}
          count={40}
          color={[0.9, 0.9, 0]}
        />
      ) : null}

      {flipResult === true &&
      (isCoinFlippingAnimationFrame === 10 ||
        isCoinFlippingAnimationFrame === 11) ? (
        <>
          <ParticlesTowardsCamera color={new Color(0.7, 0.6, 0)} />
          <ParticlesTowardsCamera color={new Color(0.8, 0.5, 0.1)} />
        </>
      ) : null}
    </>
  );
}

function Camera() {
  const [cameraPosition] = useAtom(GameState.cameraPosition);

  const [vec] = useState(() => new Vector3());
  return useFrame((state) => {
    if (cameraPosition === 1) {
      state.camera.position.lerp(vec.set(0, 600, 0), 1);
    } else if (cameraPosition === 2) {
      state.camera.position.lerp(vec.set(0, 65, 55), 0.2);
    } else {
      state.camera.position.lerp(
        vec.set(-state.pointer.x * 40, 10 + state.pointer.y * 4 * -1, 90),
        0.09
      );
    }

    state.camera.lookAt(0, 0, 0);
  });
}

function Ground() {
  return (
    <mesh position={[0, -1, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[250, 250]} />
      <MeshReflectorMaterial
        blur={[10000, 10000]}
        resolution={2048}
        mixBlur={1}
        mixStrength={100}
        roughness={10}
        depthScale={1.4}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color={new Color(0.01, 0.015, 0.01)}
        metalness={0.8}
        mirror={0.5}
      />
    </mesh>
  );
}

export default App;
