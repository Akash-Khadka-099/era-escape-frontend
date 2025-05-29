import { DatePicker } from "antd";
import PropTypes from "prop-types";
import dayjs from "dayjs";

const CustomDatePicker = ({
  format = "YYYY/MM/DD",
  value,
  onChange,
  ...props
}) => {
  const dateValue = value ? dayjs(value, format) : null;

  const handleChange = (date, dateString) => {
    if (onChange) {
      // Pass the formatted string (e.g., "2025/03/31") to the form
      onChange(dateString || null);
    }
  };

  return (
    <DatePicker
      format={format}
      value={dateValue}
      onChange={handleChange}
      style={{ width: "100%" }}
      {...props}
    />
  );
};

CustomDatePicker.propTypes = {
  format: PropTypes.string,
  value: PropTypes.string, // Expecting a string (e.g., "2025/03/31")
  onChange: PropTypes.func, // Form onChange handler
};

export default CustomDatePicker;
