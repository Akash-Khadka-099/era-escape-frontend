import PackageCards from "@/components/Cards/PackageCards";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import {
  Button,
  Col,
  Flex,
  Form,
  Radio,
  Row,
  Select,
  Slider,
  Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";

const { Option } = Select;
const { Text } = Typography;

const featuresLists = ["Beautiful  views", "Peaceful gardens", "Discounts"];

const imageLists = [
  "https://www.speedynepal.com/public/images/upload/package/slider/kalinchowk-speedy.jpg",
  "https://cdn.pixabay.com/photo/2023/06/20/06/00/mountain-8076119_640.jpg",
  "https://powertraveller.com/wp-content/uploads/2024/09/5_from-kathmandu-2-night-3-days-kalinchowk-snow-trek-2.jpg",
];

const Packages = () => {
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const [form] = useForm();

  const onSubmitHandler = async (data) => {
    console.log("form data", data);
  };
  return (
    <>
      <MiddleContentWrapper>
        <Row gutter={16}>
          <Col span={6}>
            <div
              className="text-center py-3"
              style={{
                minHeight: "100%",
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
              >
                {/* Price Range */}
                <Form.Item label="Price Range" name="price">
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
                </Form.Item>

                {/* Duration */}
                <Form.Item label="Duration (days)" name="duration">
                  <Select placeholder="Select duration" allowClear>
                    <Option value="1">1 Day</Option>
                    <Option value="3">3 Days</Option>
                    <Option value="5">5 Days</Option>
                    <Option value="7">7 Days</Option>
                    <Option value="custom">Custom</Option>
                  </Select>
                </Form.Item>

                {/* Travel Type */}
                <Form.Item label="Travel Type" name="travelType">
                  <Select placeholder="Select type" allowClear>
                    <Option value="solo">Solo</Option>
                    <Option value="family">Family</Option>
                    <Option value="business">Business</Option>
                    <Option value="honeymoon">Honeymoon</Option>
                  </Select>
                </Form.Item>

                {/* Guide Option */}
                <Form.Item label="With Guide?" name="withGuide">
                  <Radio.Group>
                    <Radio value="yes">With Guide</Radio>
                    <Radio value="no">Without Guide</Radio>
                  </Radio.Group>
                </Form.Item>

                {/* Submit Button */}
                <Button type="primary" htmlType="submit" block>
                  Apply Filters
                </Button>
              </Form>
            </div>
          </Col>
          <Col span={18}>
            <Flex vertical gap={20}>
              {Array.from({ length: 4 })?.map((_, index) => (
                <PackageCards
                  key={index}
                  rating={3}
                  imageLists={imageLists}
                  featuresLists={featuresLists}
                />
              ))}
            </Flex>
          </Col>
        </Row>
      </MiddleContentWrapper>
    </>
  );
};

export default Packages;
