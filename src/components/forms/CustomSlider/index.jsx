import { Slider } from "antd";
import PropTypes from "prop-types";

const CustomSlider = ({
  min = 0,
  max,
  marks,
  tooltipOpen = true,
  tooltipPlacement = "top",
  ...props
}) => {
  return (
    <>
      {" "}
      <Slider
        tooltip={{ open: tooltipOpen, placement: tooltipPlacement }}
        min={min}
        max={max}
        marks={marks}
        {...props}
      />
    </>
  );
};

CustomSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  marks: PropTypes.object,
  tooltipPlacement: PropTypes.string,
  tooltipOpen: PropTypes.bool,
};
export default CustomSlider;
