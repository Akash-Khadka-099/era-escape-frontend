import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { Flex } from "antd";

interface GoogleAuthProps {
  handleCloseLoginModal: () => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ handleCloseLoginModal }) => {
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth(
    handleCloseLoginModal,
  );

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 mt-4">
   

      <Flex justify="center">
        <span className="mx-4 text-gray-500 text-sm ">Or continue with</span>
      </Flex>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
      />
    </div>
  );
};

export default GoogleAuth;
