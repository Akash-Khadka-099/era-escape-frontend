import { Button, Empty, Flex, Select, Tooltip } from "antd";
import PropTypes from "prop-types";
import nepalify from "nepalify";

const CustomSelect = ({
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
  ...props
}) => {
  // Handle the search by converting input to both English and Nepali
  const handleSearch = (inputValue) => {
    // Convert input to Nepali using nepalify and return both formats
    const nepaliSearch = nepalify.format(inputValue);
    return { english: inputValue.toLowerCase(), nepali: nepaliSearch };
  };

  // Custom filter option that checks both English and Nepali values
  const filterOption = (inputValue, option) => {
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

CustomSelect.propTypes = {
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  isMultiple: PropTypes.bool,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  helperText: PropTypes.string,
  errorMessage: PropTypes.string,
  tooltip: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.any,
  onAddNew: PropTypes.func,
};

export default CustomSelect;
