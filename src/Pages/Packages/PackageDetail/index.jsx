import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import {
  Avatar,
  Button,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Flex,
  Form,
  Image,
  List,
  Row,
  Select,
  Typography,
} from "antd";
import {
  WifiOutlined,
  CoffeeOutlined,
  CarOutlined,
  UserOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useFetchPackageBySlug } from "@/services/packageService";
import parse from "html-react-parser";

const { Panel } = Collapse;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const travelPackages = [
  { title: "WiFi", icon: <WifiOutlined /> },
  { title: "Snacks", icon: <CoffeeOutlined /> },
  { title: "Breakfast", icon: <CoffeeOutlined /> },
  { title: "Night Stay", icon: <HomeOutlined /> },
  { title: "Guide", icon: <UserOutlined /> },
  { title: "Sumo Vehicle", icon: <CarOutlined /> },
];

const PackageDetail = () => {
  const [form] = Form.useForm();
  const [guests, setGuests] = useState(1);
  const { package_slug } = useParams();

  const { data } = useFetchPackageBySlug(package_slug);

  const handleGuestsChange = (value) => {
    setGuests(value);
  };

  const packageImages = useMemo(() => {
    return data?.images?.map((item, index) => ({
      src: `${import.meta.env.VITE_API_URL}/${item?.path}`,
      alt: `${data?.title} image ${index + 1}`,
    }));
  }, [data]);

  const handleSubmit = (values) => {
    console.log("Booking details:", values);
  };
  return (
    <MiddleContentWrapper>
      <div className="mb-5">
        <Typography.Title level={2}> {data?.title}</Typography.Title>

        <Image.PreviewGroup items={packageImages}>
          <Row gutter={4}>
            <Col span={4}>
              <Image
                src={packageImages?.[0]?.src}
                alt={packageImages?.[0]?.alt}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </Col>
            <Col span={4}>
              <Image
                src={packageImages?.[1]?.src}
                alt={packageImages?.[1]?.alt}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </Col>
            <Col span={4}>
              <Image
                src={packageImages?.[2]?.src}
                alt={packageImages?.[2]?.alt}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </Col>
            <Col span={4}>
              <Image
                src={packageImages?.[3]?.src}
                alt={packageImages?.[3]?.alt}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </Col>
            <Col span={4}>
              <Image
                src={packageImages?.[4]?.src}
                alt={packageImages?.[4]?.alt}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </Col>
            <Col span={4}>
              <Image
                src={packageImages?.[5]?.src}
                alt={packageImages?.[5]?.alt}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Image.PreviewGroup>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <div>
            <Flex align="center" gap={16}>
              {" "}
              <Avatar
                shape="circle"
                src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                size={{ xs: 24, sm: 32, md: 40, lg: 50, xl: 50, xxl: 50 }}
                style={{ border: " 1px solid rgba(0,0,0,0.3)", padding: "4px" }}
              />
              <div
                style={{
                  lineHeight: "1.6",
                }}
              >
                <span>Hosted by {data?.organizationId?.organizationName} </span>
                {/* <br />
                <Typography.Text>
                  5 years of travelling experience
                </Typography.Text> */}
              </div>
            </Flex>
          </div>
          <Divider />
          <div style={{ maxWidth: "80%", textAlign: "justify" }}>
            <Typography.Text>
              {`Kalinchowk is a popular hilltop destination in Nepal, known for
              its breathtaking mountain views, snowfall in winter, and the
              revered Kalinchowk Bhagwati Temple. Located in Dolakha district at
              an altitude of 3,842 meters, it offers stunning panoramas of the
              Himalayas, including Langtang, Gaurishankar, and Everest. It's a
              favorite spot for pilgrims, trekkers, and snow lovers, with a
              cable car service providing easy access to the summit. The area is
              also a gateway to Rolwaling Valley and is famous for its cultural
              and natural beauty.`}
            </Typography.Text>
          </div>
          <Divider />
          <div>
            <Typography.Title level={4}>
              Services and Facilities
            </Typography.Title>
            <Row gutter={[16, 16]}>
              {travelPackages.map((item, index) => (
                <Col span={12} key={index}>
                  <List.Item style={{ listStyle: "none" }}>
                    <List.Item.Meta
                      style={{ display: "flex", gap: "1rem" }}
                      avatar={item.icon}
                      description={item.title}
                    />
                  </List.Item>
                </Col>
              ))}
            </Row>
          </div>
          <Divider />
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
                      <CloseOutlined style={{ color: "red", marginRight: 8 }} />
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
          <div
            style={{
              maxWidth: 500,
              margin: "auto",
              padding: 24,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Text strong style={{ fontSize: 18, width: "100%" }}>
              Book Your Stay
            </Text>
            <Divider />
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Select Dates"
                name="dates"
                rules={[
                  { required: true, message: "Please select your dates" },
                ]}
              >
                <RangePicker
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  }
                />
              </Form.Item>

              <Form.Item
                label="Number of Guests"
                name="guests"
                rules={[
                  {
                    required: true,
                    message: "Please select number of guests",
                  },
                ]}
              >
                <Select
                  suffixIcon={<UserOutlined />}
                  onChange={handleGuestsChange}
                  value={guests}
                >
                  {[...Array(10).keys()].map((num) => (
                    <Select.Option key={num + 1} value={num + 1}>
                      {num + 1} Guest{num > 0 ? "s" : ""}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Row justify="center">
                <Col>
                  <Button type="primary" size="large" htmlType="submit">
                    Book Now
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>
    </MiddleContentWrapper>
  );
};

export default PackageDetail;
