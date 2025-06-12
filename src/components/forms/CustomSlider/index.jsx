import { Slider } from "antd";
import PropTypes from "prop-types";

const CustomSlider = ({ min = 0, max, marks, ...props }) => {
  return (
    <>
      {" "}
      <Slider
        min={min}
        max={max}
        marks={marks}
        tooltip={{ open: true }}
        {...props}
      />
    </>
  );
};

CustomSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  marks: PropTypes.object,
};
export default CustomSlider;
