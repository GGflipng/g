import ButtonFlip from "./ButtonFlip";
import ButtonSoundEnabled from "./ButtonSoundEnabled";

export function Overlay() {
  return (
    <>
      <div className="absolute top-0 left-0 font-mono w-full h-full pointer-events-none">
        <div className="flex flex-row justify-between items-end h-full p-24">
          <ButtonSoundEnabled />
          <ButtonFlip />
        </div>
      </div>
    </>
  );
}
