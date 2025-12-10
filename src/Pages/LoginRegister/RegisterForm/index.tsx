import React, { useState } from "react";
import { useCreateUsers } from "@/services/userServices";
import { Button, Col, Form, Input, message, Row } from "antd";

interface RegisterFormProps {
  handleCloseLoginModal: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ handleCloseLoginModal }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [form] = Form.useForm();

  const { mutateAsync, isPending } = useCreateUsers();

  const validateConfirmPassword = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject("Please confirm your password!");
    }
    if (value !== form.getFieldValue("password")) {
      return Promise.reject("Passwords do not match!");
    }
    return Promise.resolve();
  };

  const onSubmitHandler = async (values: any) => {
    try {
      const userResponse = await mutateAsync({ ...values, role: "user" });
      if (userResponse.status == 201) {
        message.success("users created successfully");
        form.resetFields();
        handleCloseLoginModal();
      }
    } catch (error) {
      console.error(error);
    }
  };
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

  return (
    <>
      {" "}
      <Form form={form} layout="vertical" onFinish={onSubmitHandler}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Full name  is required" }]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>
          </Col>{" "}
          <Col span={12}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[{ validator: validateEmail }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone number"
              name="phone"
              rules={[{ required: true, message: "Phone number is required" }]}
            >
              <Input placeholder="Enter your phone number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                placeholder="Enter your password"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[{ validator: validateConfirmPassword }]}
            >
              <Input.Password
                placeholder="Confirm your password"
                visibilityToggle={{
                  visible: confirmPasswordVisible,
                  onVisibleChange: setConfirmPasswordVisible,
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button
            loading={isPending}
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default RegisterForm;
