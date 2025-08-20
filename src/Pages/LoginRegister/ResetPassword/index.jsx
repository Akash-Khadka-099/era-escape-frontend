import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Card, Typography, Flex, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import CustomInput from "@/components/forms/CustomInput";
import { useResetPassword } from "@/services/loginService";

const { Title, Text } = Typography;

const ResetPasswordForm = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useResetPassword();

  // Extract email and token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const token = queryParams.get("token");

  const onSubmitHandler = async (values) => {
    try {
      const resetResponse = await mutateAsync({
        email: email,
        token: token,
        newPassword: values?.confirmPassword,
      });

      if (resetResponse?.status == 200) {
        message.success("Password resetted successfully");
        navigate("/");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "An error occured while resetting passwird, try again!"
      );
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      vertical
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "20px",
      }}
    >
      <Typography.Title>Package Nepal</Typography.Title>
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          background: "#fff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ color: "#1a3c6b", marginBottom: 8 }}>
            Reset Your Password
          </Title>
          <Text style={{ color: "#666" }}>
            Enter a new password for {email || "your account"}
          </Text>
        </div>

        <Form
          form={form}
          name="reset-password"
          onFinish={onSubmitHandler}
          layout="vertical"
          style={{ padding: "0 16px" }}
        >
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              {
                required: true,
                message: "Please enter your new password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number!",
              },
            ]}
          >
            <CustomInput
              type="password"
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Enter new password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <CustomInput
              type="password"
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Confirm new password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={isPending}
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                height: 40,
                borderRadius: 8,
                background: "#4a90e2",
                border: "none",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              Reset Password
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Link to={"/"} style={{ color: "#666" }}>Back to  Login</Link>
          </div>
        </Form>
      </Card>
    </Flex>
  );
};

export default ResetPasswordForm;
