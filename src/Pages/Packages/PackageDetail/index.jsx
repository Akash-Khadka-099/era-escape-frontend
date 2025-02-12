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
} from "@ant-design/icons";
import { useState } from "react";
import moment from "moment";

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

const tripPlans = [
  {
    day: "Day 1",
    details:
      "Drive to Kalinchowk, visit Kalinchowk Bhagwati temple, and enjoy the scenic views. Overnight stay at a local lodge.",
  },
  {
    day: "Day 2",
    details:
      "Explore the surrounding hills, enjoy snowfall (if season allows), and relax at the lodge with a warm meal.",
  },
  {
    day: "Day 3",
    details:
      "Return journey with stopovers at Charikot for local sightseeing and snacks.",
  },
];

const images = [
  {
    src: "https://picsum.photos/id/0/367/267",
    alt: "Kalinchowk View 1",
  },
  {
    src: "https://picsum.photos/id/29/367/267",
    alt: "Kalinchowk View 2",
  },
  {
    src: "https://picsum.photos/id/7/367/267",
    alt: "Kalinchowk Hotel Room 1",
  },
  {
    src: "https://picsum.photos/id/10/367/267",
    alt: "Kalinchowk View 3",
  },
  {
    src: "https://picsum.photos/id/24/367/267",
    alt: "Kalinchowk Hotel Room 2",
  },
  {
    src: "https://fastly.picsum.photos/id/26/4209/2769.jpg?hmac=vcInmowFvPCyKGtV7Vfh7zWcA_Z0kStrPDW3ppP0iGI",
    alt: "Kalinchowk View 4",
  },
  {
    src: "https://picsum.photos/id/28/367/267",
    alt: "Kalinchowk View 5",
  },
  {
    src: "https://picsum.photos/id/23/367/267",
    alt: "Kalinchowk Temple",
  },
  {
    src: "https://fastly.picsum.photos/id/16/2500/1667.jpg?hmac=uAkZwYc5phCRNFTrV_prJ_0rP0EdwJaZ4ctje2bY7aE",
    alt: "Kalinchowk Hotel Room 3",
  },
];

const PackageDetail = () => {
  const [form] = Form.useForm();
  const [guests, setGuests] = useState(1);

  const handleGuestsChange = (value) => {
    setGuests(value);
  };

  const handleSubmit = (values) => {
    console.log("Booking details:", values);
  };
  return (
    <MiddleContentWrapper>
      <div className="mb-5">
        <Typography.Title level={2}> Kalinchowk Plan</Typography.Title>
        <Image.PreviewGroup items={images}>
          <Row gutter={4}>
            <Col span={4}>
              <Image
                src={images[0].src}
                alt={images[0].alt}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </Col>
            <Col span={4}>
              <Image
                src={images[1].src}
                alt={images[1].alt}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </Col>
            <Col span={4}>
              <Image
                src={images[2].src}
                alt={images[2].alt}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </Col>
            <Col span={4}>
              <Image
                src={images[3].src}
                alt={images[3].alt}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </Col>
            <Col span={4}>
              <Image
                src={images[4].src}
                alt={images[4].alt}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </Col>
            <Col span={4}>
              <Image
                src={images[5].src}
                alt={images[5].alt}
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
                <span>Hosted by Nepal Travel</span>
                <br />
                <Typography.Text>
                  5 years of travelling experience
                </Typography.Text>
              </div>
            </Flex>
          </div>
          <Divider />
          <div style={{ maxWidth: "80%", textAlign: "justify" }}>
            <p>
              {`Kalinchowk is a popular hilltop destination in Nepal, known for
              its breathtaking mountain views, snowfall in winter, and the
              revered Kalinchowk Bhagwati Temple. Located in Dolakha district at
              an altitude of 3,842 meters, it offers stunning panoramas of the
              Himalayas, including Langtang, Gaurishankar, and Everest. It's a
              favorite spot for pilgrims, trekkers, and snow lovers, with a
              cable car service providing easy access to the summit. The area is
              also a gateway to Rolwaling Valley and is famous for its cultural
              and natural beauty.`}
            </p>
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
          <Typography.Title level={4}>Plans</Typography.Title>
          <Collapse bordered={false} accordion style={{ marginTop: 20 }}>
            {tripPlans.map((plan, index) => (
              <Panel header={plan.day} key={index}>
                <p>{plan.details}</p>
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
