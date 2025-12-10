import React from "react";
import { useLoginUser } from "@/services/loginService";
import { Button, Col, Form, Input, message, Row } from "antd";

interface LoginFormProps {
  handleCloseLoginModal: () => void;
  setIsForgetPassword: (value: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleCloseLoginModal, setIsForgetPassword }) => {
  const [form] = Form.useForm();

  const { mutateAsync, isPending } = useLoginUser();

  const onSubmitHandler = async (values: any) => {
    try {
      const loginResponse = await mutateAsync({ ...values });

      if (loginResponse?.status == 201) {
        message.success("Login successfull!");
        handleCloseLoginModal();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Form layout="vertical" form={form} onFinish={onSubmitHandler}>
        <Row gutter={4}>
          <Col span={24}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email  is required" }]}
            >
              <Input type="email" placeholder="Enter your email" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Password  is required" }]}
            >
              <Input type="password" placeholder="Enter your password" />
            </Form.Item>
            <span
              className="py-2 text-primary "
              style={{
                cursor: "pointer",
              }}
              onClick={() => setIsForgetPassword(true)}
            >
              Forgot Password ?
            </span>
          </Col>
        </Row>
        <Form.Item>
          <Button
            loading={isPending}
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginForm;
