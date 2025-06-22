import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import {
  Affix,
  Avatar,
  Button,
  Col,
  Collapse,
  Divider,
  Flex,
  Form,
  Image,
  List,
  Row,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchPackageBySlug } from "@/services/packageService";
import parse from "html-react-parser";
import { RiMapPinUserFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6";
import { RiSecurePaymentFill } from "react-icons/ri";
import { capitalizeFirstWord } from "@/utils/helper";
import { FaCloudMeatball } from "react-icons/fa6";
import { GiSurferVan } from "react-icons/gi";
import { LuHotel } from "react-icons/lu";
import { MdManageAccounts } from "react-icons/md";
import { GiMoon } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";
import PackageCancellationPolicyModal from "@/Pages/Packages/PackageDetail/PackageCancellationPolicyModal";
import CustomInput from "@/components/forms/CustomInput";
import CustomDatePicker from "@/components/forms/CustomDatePicker";
import dayjs from "dayjs";

const { Panel } = Collapse;
const { Text } = Typography;

const PackageDetail = () => {
  const [isCancelPolicyOpen, setIsCancelPolicyOpen] = useState(false);
  const [form] = Form.useForm();
  const { package_slug } = useParams();
  const navigate = useNavigate();

  const { data } = useFetchPackageBySlug(package_slug);

  const packageImages = useMemo(() => {
    return data?.images?.map((item, index) => ({
      src: `${import.meta.env.VITE_API_URL}/${item?.path}`,
      alt: `${data?.title} image ${index + 1}`,
    }));
  }, [data]);

  const handleSubmit = (values) => {
    console.log("Booking details:", values);
    navigate(
      `/package-booking/${package_slug}?bookedDate=${values?.bookedDate}&numberOfTravelers=${values?.numberOfTravelers}`
    );
  };

  const shortDetails = useMemo(() => {
    return [
      {
        title: `Age Range (${data?.ageRange?.[0]}-${data?.ageRange?.[1]})`,
        value: data?.ageRange?.length,
        icon: <MdManageAccounts size={20} />,
      },
      {
        title: `Night/Days (${data?.totalNights}/${data?.totalNights + 1})`,
        tooltip: "Total Night and Days in package (Night / Days)",
        value: data?.totalNights,
        icon: <GiMoon size={16} />,
      },
      {
        title: `Min Traveller (${data?.minTourists})`,
        value: data?.minTourists,
        icon: <FaUser size={16} />,
      },
      {
        title: `Max Traveller (${data?.maxTourists})`,
        value: data?.maxTourists,
        icon: <FaUserFriends size={18} />,
      },
      {
        title: `Guide (${data?.numGuides})`,
        value: data?.numGuides,
        icon: <RiMapPinUserFill size={20} />,
      },
      {
        title: `Porter (${data?.numPorters})`,
        tooltip:
          "No. of porters can be assigned based on the number of travelers.",
        value: data?.numPorters,
        icon: <FaUserShield size={18} />,
      },
      {
        title: `Insurance Required `,
        value: data?.insuranceRequired,
        tooltip: "Insurance is required for this package",
        icon: <RiSecurePaymentFill size={18} />,
      },
      {
        title: `Preferred Seasons (${data?.preferSeasons
          ?.map((item) => capitalizeFirstWord(item))
          ?.join(", ")})`,
        value: data?.preferSeasons?.length,
        icon: <FaCloudMeatball size={16} />,
      },
      {
        title: data?.vehicleType
          ?.map((item) => capitalizeFirstWord(item))
          ?.join(", "),
        value: data?.vehicleType?.length,
        tooltip: "Available vehicles  for the package",
        icon: <GiSurferVan size={18} />,
      },
      {
        title: `Rooms types (${data?.roomType
          ?.map((item) => capitalizeFirstWord(item))
          ?.join(",  ")})`,
        value: data?.roomType?.length,
        tooltip: "Rooms available for the package",
        icon: <LuHotel size={20} />,
      },
    ]?.filter((item) => item?.value);
  }, [data]);
  return (
    <>
      {" "}
      <MiddleContentWrapper>
        <div>
          <Typography.Title level={2}> {data?.title}</Typography.Title>
          {data?.tags?.length ? (
            <div style={{ margin: "8px 0" }}>
              {data?.tags?.map((item, index) => (
                <Tag key={index} color="green">
                  #{item}
                </Tag>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <div className="my-2 mb-4">
              <Image.PreviewGroup items={packageImages}>
                <Row gutter={4}>
                  <Col span={6}>
                    <Image
                      src={packageImages?.[0]?.src}
                      alt={packageImages?.[0]?.alt}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Image
                      src={packageImages?.[1]?.src}
                      alt={packageImages?.[1]?.alt}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Image
                      src={packageImages?.[2]?.src}
                      alt={packageImages?.[2]?.alt}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Image
                      src={packageImages?.[3]?.src}
                      alt={packageImages?.[3]?.alt}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  {/* <Col span={6}>
                    <Image
                      src={packageImages?.[4]?.src}
                      alt={packageImages?.[4]?.alt}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Image
                      src={packageImages?.[5]?.src}
                      alt={packageImages?.[5]?.alt}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </Col> */}
                </Row>
              </Image.PreviewGroup>
            </div>
            <div>
              <Flex align="center" gap={16}>
                {" "}
                <Avatar
                  shape="circle"
                  src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                  size={{ xs: 24, sm: 32, md: 40, lg: 50, xl: 50, xxl: 50 }}
                  style={{
                    border: " 1px solid rgba(0,0,0,0.3)",
                    padding: "4px",
                  }}
                />
                <div
                  style={{
                    lineHeight: "1.6",
                  }}
                >
                  <span>
                    Hosted by {data?.organizationId?.organizationName}{" "}
                  </span>
                  {/* <br />
                <Typography.Text>
                  5 years of travelling experience
                </Typography.Text> */}
                </div>
              </Flex>
            </div>

            <Divider />
            <div style={{ maxWidth: "80%", textAlign: "justify" }}>
              <Typography.Title level={4}>Short Overview</Typography.Title>
              <Typography.Text>{data?.description}</Typography.Text>
            </div>
            <Divider />
            {shortDetails?.length ? (
              <>
                <div
                  style={{
                    background: "#f3f6ec",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <Typography.Title level={4}>Trip Essentials</Typography.Title>
                  <Row gutter={[16, 16]}>
                    {shortDetails?.map((item, index) => (
                      <Col span={12} key={index}>
                        <Tooltip
                          title={item?.tooltip || ""}
                          placement="topLeft"
                          color="#85906d"
                        >
                          <List.Item style={{ listStyle: "none" }}>
                            <List.Item.Meta
                              style={{ display: "flex", gap: "1rem" }}
                              avatar={item?.icon}
                              description={item?.title}
                            />
                          </List.Item>
                        </Tooltip>
                      </Col>
                    ))}
                  </Row>
                </div>
                <Divider />
              </>
            ) : (
              ""
            )}
            {data?.highlightLists?.length ? (
              <>
                <div>
                  <Typography.Title level={4}>Highlights</Typography.Title>
                  <List
                    bordered={false}
                    size="small"
                    dataSource={data?.highlightLists}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          border: "none",
                        }}
                      >
                        <ArrowRightOutlined
                          style={{ color: "green", marginRight: 8 }}
                        />
                        {item}
                      </List.Item>
                    )}
                  />
                </div>
                <Divider />
              </>
            ) : (
              ""
            )}
            {/* cost includes from here  */}
            {data?.costIncludesList?.length ? (
              <>
                <div>
                  <Typography.Title level={4}>Cost Includes </Typography.Title>
                  <List
                    bordered={false}
                    size="small"
                    dataSource={data?.costIncludesList}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          border: "none",
                        }}
                      >
                        <CheckCircleOutlined
                          style={{ color: "green", marginRight: 8 }}
                        />
                        {item}
                      </List.Item>
                    )}
                  />
                </div>
                <Divider />
              </>
            ) : (
              ""
            )}

            {/* cost excludes lists from here  */}

            {data?.costExcludesList?.length ? (
              <>
                <div>
                  <Typography.Title level={4}>Cost Excludes </Typography.Title>
                  <List
                    bordered={false}
                    size="small"
                    dataSource={data?.costExcludesList}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          border: "none",
                        }}
                      >
                        <CloseOutlined
                          style={{ color: "red", marginRight: 8 }}
                        />
                        {item}
                      </List.Item>
                    )}
                  />
                </div>
                <Divider />
              </>
            ) : (
              ""
            )}
            {/* notes from here  */}
            {data?.notesList?.length ? (
              <>
                <div>
                  <Typography.Title level={4}>
                    Notes and suggestions to travellers{" "}
                  </Typography.Title>
                  <List
                    bordered={false}
                    size="small"
                    dataSource={data?.notesList}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          border: "none",
                        }}
                      >
                        <ArrowRightOutlined
                          style={{ color: "blue", marginRight: 8 }}
                        />
                        {item}
                      </List.Item>
                    )}
                  />
                </div>
                <Divider />
              </>
            ) : (
              ""
            )}

            <Typography.Title level={4}>Itineraries</Typography.Title>
            <Collapse bordered={false} accordion style={{ marginTop: 20 }}>
              {data?.itinerary?.map((item, index) => (
                <Panel header={item?.title} key={index}>
                  {parse(item?.description)}
                </Panel>
              ))}
            </Collapse>
          </Col>
          <Col span={8}>
            <Affix offsetTop={100}>
              <div
                style={{
                  background: "#fff",
                  padding: 24,
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                  // maxWidth: 400,
                }}
              >
                <Text strong style={{ fontSize: 18, width: "100%" }}>
                  Book Your Stay
                </Text>
                <Divider />
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                  <Form.Item
                    label="Select Dates"
                    name="bookedDate"
                    rules={[
                      { required: true, message: "Please select your dates" },
                    ]}
                  >
                    <CustomDatePicker
                      disabledDate={(current) => {
                        return (
                          current &&
                          current < dayjs().add(1, "day").startOf("day")
                        );
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Number of Guests"
                    name="numberOfTravelers"
                    rules={[
                      {
                        required: true,
                        message: "Please select number of guests",
                      },
                      {
                        type: "number",
                        min: data?.minTourists || 1,
                        message: `Min tourists for the package is ${
                          data?.minTourists || 1
                        }`,
                      },
                    ]}
                  >
                    <CustomInput suffixIcon={<UserOutlined />} type="number" />
                  </Form.Item>

                  <Button
                    type="primary"
                    className="w-100"
                    size="large"
                    htmlType="submit"
                  >
                    Book Now
                  </Button>
                </Form>
                <div
                  className="my-2"
                  style={{
                    backgroundColor: "#dee3d3",
                    borderRadius: "8px",
                  }}
                >
                  <List className="p-2">
                    <List.Item
                      style={{
                        border: "none",
                      }}
                    >
                      <Flex gap={4} align="center">
                        <FaCheckCircle
                          size={20}
                          style={{ color: "green", marginRight: 8 }}
                        />
                        <div>
                          Free
                          <strong
                            onClick={() => setIsCancelPolicyOpen(true)}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <u> cancellation</u>
                          </strong>{" "}
                          , if you cancel the package at least 24 hours after
                          the booking.
                        </div>
                      </Flex>
                    </List.Item>
                  </List>
                </div>
              </div>
            </Affix>
          </Col>
        </Row>
      </MiddleContentWrapper>
      <PackageCancellationPolicyModal
        isModalOpen={isCancelPolicyOpen}
        setIsModalOpen={setIsCancelPolicyOpen}
      />
    </>
  );
};

export default PackageDetail;
