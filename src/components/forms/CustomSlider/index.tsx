import React from "react";
import { Slider } from "antd";
import type { SliderSingleProps } from "antd";

interface CustomSliderProps extends Omit<SliderSingleProps, 'range'> {
  min?: number;
  max?: number;
  marks?: any;
  tooltipOpen?: boolean;
  tooltipPlacement?: "top" | "left" | "right" | "bottom";
  range?: boolean;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  min = 0,
  max,
  marks,
  tooltipOpen = true,
  tooltipPlacement = "top",
  range,
  ...props
}) => {
  return (
    <>
      {" "}
      <Slider
        range={range as any}
        tooltip={{ open: tooltipOpen, placement: tooltipPlacement }}
        min={min}
        max={max}
        marks={marks}
        {...props}
      />
    </>
  );
};

export default CustomSlider;
