import ForgetPassword from "@/Pages/LoginRegister/ForgetPassword";
import LoginForm from "@/Pages/LoginRegister/LoginForm";
import RegisterForm from "@/Pages/LoginRegister/RegisterForm";
import { Button, Flex, Image, Modal } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

const LoginRegister = ({ isLoginModalOpen, handleCloseLoginModal }) => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  return (
    <>
      {" "}
      <Modal
        width={600}
        onCancel={handleCloseLoginModal}
        open={isLoginModalOpen}
        title={
          isForgetPassword
            ? "Forgot Password and Recovery"
            : "Sign in or create an account"
        }
        footer={null}
      >
        {isForgetPassword ? (
          <ForgetPassword setIsForgetPassword={setIsForgetPassword} />
        ) : (
          <>
            <Flex justify="end">
              <Button onClick={() => setIsLoginPage(!isLoginPage)}>
                {isLoginPage ? "Register" : "Login"}
              </Button>
            </Flex>
            <Image
              preview={false}
              width={"100%"}
              height={200}
              style={{ objectFit: "contain" }}
              src={"/images/login.png"}
            />
            <div className="my-4">
              {isLoginPage ? (
                <LoginForm
                  setIsForgetPassword={setIsForgetPassword}
                  handleCloseLoginModal={handleCloseLoginModal}
                />
              ) : (
                <RegisterForm handleCloseLoginModal={handleCloseLoginModal} />
              )}
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

LoginRegister.propTypes = {
  isLoginModalOpen: PropTypes.bool,
  handleCloseLoginModal: PropTypes.func,
};

export default LoginRegister;
