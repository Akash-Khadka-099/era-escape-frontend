import React, { useEffect, useState } from "react";
import ForgetPassword from "@/Pages/LoginRegister/ForgetPassword";
import LoginForm from "@/Pages/LoginRegister/LoginForm";
import RegisterForm from "@/Pages/LoginRegister/RegisterForm";
import GoogleAuth from "@/Pages/LoginRegister/GoogleAuth";
import useAuthStore from "@/store/authStore";
import { Button, Flex, Image, Modal } from "antd";

interface LoginRegisterProps {
  isLoginModalOpen: boolean;
  handleCloseLoginModal: () => void;
}

const LoginRegister: React.FC<LoginRegisterProps> = ({
  isLoginModalOpen,
  handleCloseLoginModal,
}) => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isLoginModalOpen && isAuthenticated) {
      handleCloseLoginModal();
    }
  }, [isLoginModalOpen, isAuthenticated, handleCloseLoginModal]);

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
              <GoogleAuth handleCloseLoginModal={handleCloseLoginModal} />
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default LoginRegister;
