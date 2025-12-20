import React, { useCallback, useEffect, useState } from "react";
import PackageCards from "@/components/Cards/PackageCards";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import CustomPackageSearch from "@/components/CustomPackageSearch";
import { useSearchPackageLists } from "@/services/searchPackageLists";
import {
  Affix,
  Button,
  Col,
  Flex,
  Form,
  message,
  Row,
  Slider,
  Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Lottie from "react-lottie";
import NoDataFound from "@/assets/JsonAnimation/noDataFound.json";
import CustomPagination from "@/components/CustomPagination";
import { useSearchParams } from "react-router-dom";

const { Text } = Typography;

const featuresLists: string[] = ["Beautiful  views", "Peaceful gardens", "Discounts"];

const Packages: React.FC = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
  });
  const [form] = useForm();
  const [listedPackages, setListedPackages] = useState<any>({});
  const [packageSearchValue, setPackageSearchValue] = useState("");
  const [successSearchValue, setSuccessSearchValue] = useState("");
  // const [priceRange, setPriceRange] = useState([500, 5000]);
  const [totalNightRange, setTotalNightRange] = useState([1, 20]);
  // const { search } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search");

  const { mutateAsync, isPending } = useSearchPackageLists();

  useEffect(() => {
    if (searchQuery) {
      setPackageSearchValue(searchQuery);
    }
    mutateAsync({
      q: searchQuery || "",
      page: pagination?.page,
      limit: pagination?.pageSize,
    }).then((response) => {
      if (response?.status == 200) {
        setListedPackages(response?.data || []);
      }
    });
  }, [pagination]);

  const onSubmitHandler = useCallback(async () => {
    try {
      const filterPackageResponse = await mutateAsync({
        q: searchQuery,
        minNights: totalNightRange?.[0],
        maxNights: totalNightRange?.[1],
      });
      if (filterPackageResponse?.status == 200) {
        setListedPackages(filterPackageResponse?.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  }, [searchQuery, totalNightRange]);

  const onSearchHandler = useCallback(
    async (value: string) => {
      try {
        const searchResponse = await mutateAsync({
          q: value,
        });

        if (searchResponse?.status == 200) {
          setListedPackages(searchResponse?.data || []);
          setSuccessSearchValue(value);
          searchParams.set("search", value);
          setSearchParams(searchParams);
        }
      } catch (error) {
        message.error("Error occured while searching packages");
        console.error(error);
      }
    },
    [packageSearchValue]
  );

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoDataFound,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <>
      <Flex justify="center" align="center">
        <div style={{ width: "clamp(400px, 600px, 80%)" }}>
          <CustomPackageSearch
            searchValue={packageSearchValue}
            setSearchValue={setPackageSearchValue}
            onSearchHandler={onSearchHandler}
            isLoading={isPending}
          />
        </div>
      </Flex>

      <MiddleContentWrapper>
        <Row gutter={16}>
          <Col span={6}>
            <Affix offsetTop={100}>
              <div
                className="text-center py-3"
                style={{
                  height: "clamp(500px, 600px, 100%)",
                  border: "1px solid rgba(0,0,0,0.3)",
                  borderRadius: "8px",
                }}
              >
                <Typography.Title level={4}>Filters</Typography.Title>
                <Form
                  className="p-5"
                  layout="vertical"
                  form={form}
                  onFinish={onSubmitHandler}
                  initialValues={{
                    totalNightRange: [1, 20],
                  }}
                >
                  {/* Price Range */}
                  {/* <Form.Item label="Price Range" name="price">
                  <Slider
                    range
                    min={100}
                    max={10000}
                    step={100}
                    defaultValue={priceRange}
                    onChange={(value) => setPriceRange(value)}
                  />
                  <Text type="secondary">
                    Price Range: Rs{priceRange[0]} - Rs{priceRange[1]}
                  </Text>
                </Form.Item> */}

                  <Form.Item
                    label={"Total Night's Range"}
                    name={"totalNightRange"}
                    valuePropName="value"
                  >
                    <Slider
                      min={1}
                      max={20}
                      // defaultValue={[1, 20]}
                      range={true}
                      onChange={(value: number[]) => setTotalNightRange(value)}
                    />

                    <Text type="secondary">
                      Total Night Range: {totalNightRange?.[0]} -{" "}
                      {totalNightRange?.[1]}
                    </Text>
                  </Form.Item>

                  {/* Duration */}
                  {/* <Form.Item label="Duration (days)" name="duration">
                  <Select placeholder="Select duration" allowClear>
                    <Option value="1">1 Day</Option>
                    <Option value="3">3 Days</Option>
                    <Option value="5">5 Days</Option>
                    <Option value="7">7 Days</Option>
                    <Option value="custom">Custom</Option>
                  </Select>
                </Form.Item> */}

                  {/* Travel Type */}
                  {/* <Form.Item label="Travel Type" name="travelType">
                  <Select placeholder="Select type" allowClear>
                    <Option value="solo">Solo</Option>
                    <Option value="family">Family</Option>
                    <Option value="business">Business</Option>
                    <Option value="honeymoon">Honeymoon</Option>
                  </Select>
                </Form.Item> */}

                  {/* Guide Option */}
                  {/* <Form.Item label="With Guide?" name="withGuide">
                  <Radio.Group>
                    <Radio value="yes">With Guide</Radio>
                    <Radio value="no">Without Guide</Radio>
                  </Radio.Group>
                </Form.Item> */}

                  {/* Submit Button */}
                  <Button type="primary" htmlType="submit" block>
                    Apply Filters
                  </Button>
                </Form>
              </div>
            </Affix>
          </Col>
          <Col span={18}>
            {successSearchValue ? (
              <div
                style={{
                  marginBottom: "1rem",
                }}
              >
                <Typography.Title level={3} type="secondary">
                  {" "}
                  Search Result For : {successSearchValue}
                </Typography.Title>
              </div>
            ) : (
              ""
            )}
            {!isPending && !listedPackages?.data?.length ? (
              <>
                <Flex
                  vertical
                  align="center"
                  className="mt-4"
                  justify="center"
                  style={{ width: "80%" }}
                >
                  <Lottie
                    options={defaultOptions}
                    height={200}
                    width={300}
                    style={{
                      minHeight: 300,
                    }}
                  />
                  <Typography.Title level={5} type="secondary">
                    {`Sorry, we don’t have any tour packages that fit your search right now`}
                  </Typography.Title>
                </Flex>
              </>
            ) : (
              <>
                <Flex vertical gap={20}>
                  {listedPackages?.data?.map((item: any, index: number) => (
                    <PackageCards
                      key={index}
                      rating={3}
                      packageDetail={item}
                      featuresLists={featuresLists}
                    />
                  ))}
                </Flex>
                <div
                  style={{
                    marginTop: "1rem",
                  }}
                >
                  <CustomPagination
                    onChange={(value: number) =>
                      setPagination((oldState) => ({
                        ...oldState,
                        page: value,
                      }))
                    }
                    paginationDetail={{
                      page: listedPackages?.pagination?.page,
                      totalData: listedPackages?.pagination?.total,
                      pageSize: listedPackages?.pagination?.limit,
                    }}
                  />
                </div>
              </>
            )}
          </Col>
        </Row>
      </MiddleContentWrapper>
    </>
  );
};

export default Packages;
