import CustomInput from "@/components/forms/CustomInput";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, Image, Row } from "antd";
import PropTypes from "prop-types";

const ForgetPassword = ({ setIsForgetPassword }) => {
  const [form] = Form.useForm();

  const validateEmail = (_, value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) {
      return Promise.reject("Email is required!");
    }
    if (!emailRegex.test(value)) {
      return Promise.reject("Enter a valid email address!");
    }
    return Promise.resolve();
  };

  return (
    <>
      <Image
        preview={false}
        width={"100%"}
        height={200}
        style={{ objectFit: "contain" }}
        src={"/images/forgot-password.png"}
      />
      <Form form={form} layout="vertical">
        <Row gutter={4}>
          <Col span={24}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[{ validator: validateEmail }]}
            >
              <CustomInput type="email" placeholder="Enter your email" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                Reset Password
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Flex justify="center">
        <span
          className=" text-primary "
          style={{
            cursor: "pointer",
          }}
          onClick={() => setIsForgetPassword(false)}
        >
          <LeftOutlined /> {" Back To Login"}
        </span>
      </Flex>
    </>
  );
};

ForgetPassword.propTypes = {
  setIsForgetPassword: PropTypes.func,
};

export default ForgetPassword;
