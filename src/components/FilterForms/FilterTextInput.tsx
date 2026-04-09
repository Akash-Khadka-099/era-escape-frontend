import React from "react";
import { Flex, Input, Typography } from "antd";
import { useDebouncedFieldValue } from "./useDebouncedFieldValue";

const { Text } = Typography;

interface FilterTextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const FilterTextInput: React.FC<FilterTextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  debounceMs = 400,
}) => {
  const [internalValue, setInternalValue] = useDebouncedFieldValue(
    value,
    onChange,
    debounceMs,
  );

  return (
    <Flex vertical gap={8}>
      <Text strong>{label}</Text>
      <Input
        allowClear
        value={internalValue}
        placeholder={placeholder}
        onChange={(event) => setInternalValue(event.target.value)}
      />
    </Flex>
  );
};

export default FilterTextInput;
