import { useLoginUser } from "@/services/loginService";
import { Button, Col, Form, Input, Row } from "antd";

const LoginForm = () => {
  const [form] = Form.useForm();

  const { mutateAsync, isPending } = useLoginUser();

  const onSubmitHandler = async (values) => {
    try {
      const loginResponse = await mutateAsync({ ...values });

      if (loginResponse?.status == 201) {
        console.log("loginResponse", loginResponse);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Form layout="vertical" form={form} onFinish={onSubmitHandler}>
        <Row gutter={8}>
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
