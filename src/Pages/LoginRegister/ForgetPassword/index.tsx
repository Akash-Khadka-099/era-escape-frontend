import React from "react";
import CustomInput from "@/components/forms/CustomInput";
import { useForgetPassword } from "@/services/loginService";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, Image, message, Row } from "antd";

interface ForgetPasswordProps {
  setIsForgetPassword: (value: boolean) => void;
}

const ForgetPassword: React.FC<ForgetPasswordProps> = ({ setIsForgetPassword }) => {
  const [form] = Form.useForm();

  const { mutateAsync, isPending } = useForgetPassword();

  const validateEmail = (_: unknown, value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) {
      return Promise.reject("Email is required!");
    }
    if (!emailRegex.test(value)) {
      return Promise.reject("Enter a valid email address!");
    }
    return Promise.resolve();
  };

  const onSubmitHandler = async (values: { email: string }) => {
    try {
      const response = await mutateAsync(values);
      if (response?.status == 200) {
        message.success("check your email for updating password");
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || "");
    }
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
      <Form form={form} layout="vertical" onFinish={onSubmitHandler}>
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
                loading={isPending}
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

export default ForgetPassword;
