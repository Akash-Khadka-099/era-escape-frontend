import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input } from "antd";
import PropTypes from "prop-types";

const CustomPackageSearch = ({
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

CustomPackageSearch.propTypes = {
  setSearchValue: PropTypes.func,
  onSearchHandler: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default CustomPackageSearch;
