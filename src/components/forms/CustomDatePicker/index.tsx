import React from "react";
import { DatePicker, DatePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";

interface CustomDatePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
  format?: string;
  value?: any;
  onChange?: any;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  format = "YYYY/MM/DD",
  value,
  onChange,
  ...props
}) => {
  const dateValue = value ? dayjs(value, format) : null;

  const handleChange = (_: Dayjs | null, dateString: string | string[]) => {
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

export default CustomDatePicker;
