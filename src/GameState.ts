import { atom } from "jotai";

const isCoinFlippingAnimation = atom(8);
const isFlipButtonDisabled = atom(false);
const isFlipButtonHovered = atom(false);
const cameraPosition = atom(0);
const GameCoinState = atom(0);
const coinY = atom(0);
const soundEnabled = atom(true);

export {
  cameraPosition,
  isCoinFlippingAnimation,
  isFlipButtonHovered,
  isFlipButtonDisabled,
  GameCoinState,
  coinY,
  soundEnabled,
};
