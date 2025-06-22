import CustomCard from "@/components/Cards/CustomCard";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import CustomInput from "@/components/forms/CustomInput";
import { CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Image,
  Row,
  Steps,
  Typography,
} from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

const { Step } = Steps;

const PackageBooking = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const onSubmitHandler = async (values) => {
    console.log("values", values);
  };

  const stepFields = [
    ["name", "email", "phone"],
    ["pickUpLocation", "pickUpTime"],
    ["creditCardNumber", "expiryDate", "cvv"],
  ];

  const next = () => {
    form
      .validateFields(stepFields[currentStep])
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch(() => {
        // Validation failed
      });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <MiddleContentWrapper>
      <Row gutter={16}>
        <Col span={16}>
          <div className="my-4">
            <Steps current={currentStep} status="process">
              <Step title="Contact Details" />
              <Step title="Pick Up Details and Queries" />
              <Step title="Payment Process" />
            </Steps>
          </div>
          <Form form={form} onFinish={onSubmitHandler} layout="vertical">
            <div style={{ display: currentStep === 0 ? "block" : "none" }}>
              <Typography.Title level={3}>Contact details</Typography.Title>
              <Typography.Text>{`We'll use this information to send you confirmation and updates about your booking
`}</Typography.Text>
              <Divider />
              <Row gutter={[16, 8]}>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[
                      { required: true, message: "First Name is required" },
                    ]}
                  >
                    <CustomInput />
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[
                      { required: true, message: "Last Name is required" },
                    ]}
                  >
                    <CustomInput />
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="contactNumber"
                    label="Contact Number"
                    rules={[
                      {
                        required: true,
                        message: "Contact Number is required",
                      },
                    ]}
                  >
                    <CustomInput />
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        type: "email",
                        message: "Enter a valid email address",
                      },
                      {
                        required: true,
                        message: "Emails is required",
                      },
                    ]}
                  >
                    <CustomInput type="email" />
                  </Form.Item>
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    name="secondaryContactNumber"
                    label="Secondary Contact Number"
                  >
                    <CustomInput />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div style={{ display: currentStep === 1 ? "block" : "none" }}>
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <Form.Item
                    name="pickUpLocation"
                    label="Pick Up Location"
                    rules={[
                      {
                        required: true,
                        message: "Pick Up location is required",
                      },
                    ]}
                  >
                    <CustomInput />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="queries" label="Queries">
                    <CustomInput rows={4} type="textarea" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div style={{ display: currentStep === 2 ? "block" : "none" }}>
              <Form.Item
                name="paymentOption"
                label="Payment Option"
                rules={[
                  { required: true, message: "Please select a payment option" },
                ]}
              >
                <PaymentOptionSelector />
              </Form.Item>
            </div>

            <div style={{ marginTop: 20 }}>
              {currentStep > 0 && (
                <Button style={{ margin: "0 8px" }} onClick={prev}>
                  Previous
                </Button>
              )}
              {currentStep < 2 && (
                <Button type="primary" onClick={next}>
                  Next
                </Button>
              )}
              {currentStep === 2 && (
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              )}
            </div>
          </Form>
        </Col>
        <Col span={8}>hello</Col>
      </Row>
    </MiddleContentWrapper>
  );
};

const paymentOptions = [
  {
    name: "Esewa",
    value: "esewa",
    logo: "https://play-lh.googleusercontent.com/MRzMmiJAe0-xaEkDKB0MKwv1a3kjDieSfNuaIlRo750_EgqxjRFWKKF7xQyRSb4O95Y",
  },
  {
    name: "Khalti",
    value: "khalti",
    logo: "https://play-lh.googleusercontent.com/Xh_OlrdkF1UnGCnMN__4z-yXffBAEl0eUDeVDPr4UthOERV4Fll9S-TozSfnlXDFzw",
  },
  {
    name: "IME Pay",
    value: "imePay",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQjwbYrEBIYPzKbAHRTtN0Ovjht9q-Lv5C2Q&s",
  },
];

const PaymentOptionSelector = ({ value, onChange }) => {
  return (
    <Flex gap={16} justify="space-evenly">
      {paymentOptions?.map((option) => (
        <div key={option.value} style={{ textAlign: "center" }}>
          <CustomCard
            hoverable
            style={{
              width: 150,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border:
                value === option.value
                  ? "2px solid green"
                  : "1px solid #d9d9d9",
              position: "relative",
              cursor: "pointer",
              borderRadius: "8px",
            }}
            onClick={() => onChange(option?.value)}
          >
            <Image
              preview={false}
              src={option?.logo}
              alt={option?.name}
              style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "cover" }}
            />
            {value === option?.value && (
              <CheckOutlined
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  color: "green",
                  fontSize: "16px",
                }}
              />
            )}
          </CustomCard>
          <Typography.Text>{option?.name}</Typography.Text>
        </div>
      ))}
    </Flex>
  );
};

PaymentOptionSelector.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export default PackageBooking;
