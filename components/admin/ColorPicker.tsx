import { HexColorInput, HexColorPicker } from "react-colorful";
import { useState } from "react";

interface Props {
  value?: string;
  onPickerChange: (color: string) => void;
}

const ColorPicker = ({ value, onPickerChange }: Props) => {
  value = value ? value : "2d2d2d";

  return (
    <div className={"relative"}>
      <div className={"flex flex-row items-center"}>
        <p>#</p>
        <HexColorInput
          color={value}
          onChange={onPickerChange}
          className={"hex-input"}
        />
      </div>
      <HexColorPicker color={value} onChange={onPickerChange} />
    </div>
  );
};

export default ColorPicker;
