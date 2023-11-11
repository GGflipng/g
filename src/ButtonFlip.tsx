import { useAtom } from "jotai";
import * as state from "./GameState";
import { debounce } from "lodash";

function ButtonFlip() {
  const [isFlipButtonDisabled, setIsFlipButtonDisabled] = useAtom(
    state.isFlipButtonDisabled
  );

  const [, setIsFlipButtonHovered] = useAtom(state.isFlipButtonHovered);

  const [isCoinFlippingAnimation] = useAtom(state.isCoinFlippingAnimation);

  // rendering issues with the DOM, thus the need for debounce
  const debouncedHandlePointerEnter = debounce(() => {
    setIsFlipButtonHovered(true);
  }, 10);

  const debouncedHandlePointerLeave = debounce(() => {
    setIsFlipButtonHovered(false);
  }, 10);

  return (
    <>
      <button
        onClick={() => {
          if (!isFlipButtonDisabled) {
            setIsFlipButtonDisabled(true);
          }
        }}
        onPointerEnter={debouncedHandlePointerEnter}
        onPointerLeave={debouncedHandlePointerLeave}
        className={`pointer-events-auto z-10 border-b-[1px] ${
          !isFlipButtonDisabled || isCoinFlippingAnimation === 11
            ? "hover:skew-y-3 hover:border-yellow-500 hover:border-b-[2px] hover:px-28 text-white"
            : "text-gray-700 border-gray-500 pointer-events-none"
        }  duration-500 hover:duration-200 bg-gradient-to-r from-transparent via-black to-transparent bg-no-repeat bg-center rounded-lg px-20 py-4`}
      >
        Flip
      </button>
    </>
  );
}

export default ButtonFlip;
