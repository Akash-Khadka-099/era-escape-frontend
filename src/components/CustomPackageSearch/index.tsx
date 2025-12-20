import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input } from "antd";

interface CustomPackageSearchProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  onSearchHandler: (value: string) => void;
  isLoading?: boolean;
}

const CustomPackageSearch: React.FC<CustomPackageSearchProps> = ({
  searchValue,
  setSearchValue,
  onSearchHandler,
  isLoading = false,
}) => {
  return (
    <>
      {" "}
      <AutoComplete
        onChange={(e) => setSearchValue(e)}
        className="w-100 my-3"
        // options={destination_options}
        value={searchValue}
        size="large"
        dropdownMatchSelectWidth={false}
      >
        <Input.Search
          loading={isLoading}
          onSearch={onSearchHandler}
          placeholder="Search Destinations"
          style={{ height: "60px", borderRadius: "1.2rem", fontSize: "1rem" }}
          size="large"
          prefix={
            <span style={{ fontSize: "20px", color: "rgba(0,0,0,0.4)" }}>
              <SearchOutlined />
            </span>
          }
        />
      </AutoComplete>
    </>
  );
};

export default CustomPackageSearch;
