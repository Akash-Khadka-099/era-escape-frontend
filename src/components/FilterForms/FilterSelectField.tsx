import React from "react";
import { Flex, Select, Typography } from "antd";
import { useDebouncedFieldValue } from "./useDebouncedFieldValue";

const { Text } = Typography;

interface FilterSelectOption {
  label: string;
  value: string;
}

interface FilterSelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  placeholder?: string;
  debounceMs?: number;
}

const FilterSelectField: React.FC<FilterSelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  debounceMs = 250,
}) => {
  const [internalValue, setInternalValue] = useDebouncedFieldValue(
    value,
    onChange,
    debounceMs,
  );

  return (
    <Flex vertical gap={8}>
      <Text strong>{label}</Text>
      <Select
        value={internalValue}
        options={options}
        placeholder={placeholder}
        className="custom-filter-select"
        onChange={(nextValue) => setInternalValue(nextValue)}
      />
    </Flex>
  );
};

export default FilterSelectField;
