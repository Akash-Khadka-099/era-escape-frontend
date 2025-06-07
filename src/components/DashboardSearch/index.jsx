import { useMemo, useState } from "react";
import { AutoComplete, Input, Avatar, Flex, Button } from "antd";
import { ArrowRightOutlined, SearchOutlined } from "@ant-design/icons";
import { useSearchDashboardDestination } from "@/services/searchDestinationService";

const DashboardSearch = () => {
  const [searchValue, setSearchValue] = useState(null);
  //   const [options, setOptions] = useState([]);

  const { data } = useSearchDashboardDestination({
    q: searchValue,
  });

  const destination_options = useMemo(() => {
    return data?.data?.map((item) => ({
      value: item.title,
      label: (
        <Flex justify="space-between" align="center">
          <div className="d-flex align-items-center py-2 px-2">
            <Avatar
              shape="square"
              size={50}
              src={
                item?.profileImage?.path
                  ? `${import.meta.env.VITE_API_URL}/${
                      item?.profileImage?.path
                    }`
                  : "images/dummyImage.jpg"
              }
              className="me-3"
            />
            <div>
              <div className="fw-bold">{item?.title}</div>
              <div className="text-muted small">{item?.location}</div>
            </div>
          </div>
          <div>
            <Button
              variant="text"
              type="link"
              color="green"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
            >
              View
            </Button>
          </div>
        </Flex>
      ),
    }));
  }, [data]);

  return (
    <AutoComplete
      className="w-100 my-3"
      options={destination_options}
      onSearch={(value) => setSearchValue(value)}
      size="large"
      dropdownMatchSelectWidth={false}
    >
      <Input.Search
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
  );
};

export default DashboardSearch;
