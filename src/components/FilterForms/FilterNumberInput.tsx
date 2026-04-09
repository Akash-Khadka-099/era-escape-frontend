import React, { useCallback } from "react";
import { Flex, Input, Typography } from "antd";
import { useDebouncedFieldValue } from "./useDebouncedFieldValue";

const { Text } = Typography;

interface FilterNumberInputProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  debounceMs?: number;
  min?: number;
  max?: number;
  errorMessage?: string;
}

const FilterNumberInput: React.FC<FilterNumberInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  debounceMs = 400,
  min,
  max,
  errorMessage,
}) => {
  const normalizedValue = value === null ? "" : String(value);

  const handleDebouncedChange = useCallback(
    (nextValue: string) => {
      if (!nextValue.trim()) {
        onChange(null);
        return;
      }

      const parsedValue = Number(nextValue);
      if (Number.isNaN(parsedValue)) {
        return;
      }

      onChange(parsedValue);
    },
    [onChange],
  );

  const [internalValue, setInternalValue] = useDebouncedFieldValue(
    normalizedValue,
    handleDebouncedChange,
    debounceMs,
  );

  return (
    <Flex vertical gap={8}>
      <Text strong>{label}</Text>
      <Input
        allowClear
        type="number"
        min={min}
        max={max}
        value={internalValue}
        status={errorMessage ? "error" : undefined}
        placeholder={placeholder}
        onChange={(event) => setInternalValue(event.target.value)}
      />
      {errorMessage ? (
        <Text type="danger" style={{ fontSize: "12px" }}>
          {errorMessage}
        </Text>
      ) : null}
    </Flex>
  );
};

export default FilterNumberInput;
