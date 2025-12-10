import React from "react";
import { Button, Empty, Flex, Select, Tooltip, SelectProps } from "antd";
import nepalify from "nepalify";

interface CustomSelectProps extends Omit<SelectProps, 'onChange' | 'options'> {
  options?: any[];
  placeholder?: string;
  isLoading?: boolean;
  label?: string;
  id?: string;
  name?: string;
  isMultiple?: boolean;
  isRequired?: boolean;
  onChange?: (value: any) => void;
  helperText?: string;
  errorMessage?: string;
  tooltip?: string;
  value?: any;
  defaultValue?: any;
  onAddNew?: () => void;
  onSearch?: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder,
  isLoading,
  label,
  id,
  name,
  isMultiple = false,
  isRequired,
  onChange,
  helperText,
  errorMessage,
  tooltip = "",
  value,
  defaultValue,
  onAddNew,
  onSearch,
  ...props
}) => {
  // Handle the search by converting input to both English and Nepali
  const handleSearch = (inputValue: string) => {
    // Convert input to Nepali using nepalify and return both formats
    const nepaliSearch = nepalify.format(inputValue);
    return { english: inputValue.toLowerCase(), nepali: nepaliSearch };
  };

  // Custom filter option that checks both English and Nepali values
  const filterOption = (inputValue: string, option: any) => {
    const { english, nepali } = handleSearch(inputValue);

    // Filter the options by matching either English or Nepali
    return (
      option?.label.toLowerCase().includes(english) ||
      option?.label.includes(nepali)
    );
  };

  return (
    <>
      <label htmlFor={id || name} className="mb-0">
        {label}
        {isRequired && <i className="text-danger">*</i>}
      </label>
      <Tooltip title={tooltip}>
        <Select
          defaultValue={defaultValue}
          showSearch
          value={value}
          mode={isMultiple ? "multiple" : undefined}
          onChange={onChange}
          onSearch={onSearch}
          placeholder={placeholder || "Select"}
          loading={isLoading}
          filterOption={filterOption}
          options={options}
          notFoundContent={
            onAddNew ? (
              <Flex vertical gap={6}>
                No data found, Would you like to add ?
                <div>
                  <Button
                    variant="filled"
                    color="green"
                    className="w-100"
                    onClick={onAddNew}
                  >
                    Add New
                  </Button>
                </div>
              </Flex>
            ) : (
              <Empty />
            )
          }
          {...props}
        />
      </Tooltip>
      {errorMessage && <span className="px-2 text-danger">{errorMessage}</span>}
      {helperText && <span className="text-secondary">{helperText}</span>}
    </>
  );
};

export default CustomSelect;
