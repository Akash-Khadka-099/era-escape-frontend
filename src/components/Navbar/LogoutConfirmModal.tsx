import React from "react";
import { useLogoutUser } from "@/services/loginService";
import { Modal, Typography } from "antd";

interface LogoutConfirmModalProps {
  isOpen?: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({ isOpen = false, setIsOpen }) => {
  const { mutateAsync, isPending } = useLogoutUser();
  const onLogoutHandler = async () => {
    try {
      const logoutResponse = await mutateAsync();

      if (logoutResponse?.logoutStatus) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Modal
        title="Logout Confirmation"
        // closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        onOk={onLogoutHandler}
        onCancel={() => setIsOpen(false)}
        okButtonProps={{
          //   type: "default",
          color: "cyan",
          loading: isPending,
        }}
        okText={"Logout"}
      >
        <Typography.Title level={5}>
          Are you sure, you want to logout ?
        </Typography.Title>
      </Modal>
    </>
  );
};

export default LogoutConfirmModal;
