import { Button, Form, Image, Input, Modal, Typography } from "antd";
import PropTypes from "prop-types";

const LoginRegister = ({ isLoginModalOpen, handleCloseLoginModal }) => {
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

  const onFinish = (values) => {
    console.log("Submitted values:", values);
  };
  return (
    <>
      {" "}
      <Modal
        width={500}
        onCancel={handleCloseLoginModal}
        open={isLoginModalOpen}
        title={"Sign in or create an account"}
        footer={null}
      >
        <Typography.Title className="text-center text-muted" level={4} >Welcome to Jokers world</Typography.Title>
        <Image
          preview={false}
          width={"100%"}
          height={200}
          style={{ objectFit: "contain" }}
          src={"/images/login.png"}
        />
        <div className="my-4">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[{ validator: validateEmail }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item>
              <Button style={{width: "100%"}} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

LoginRegister.propTypes = {
  isLoginModalOpen: PropTypes.bool,
  handleCloseLoginModal: PropTypes.func,
};

export default LoginRegister;
