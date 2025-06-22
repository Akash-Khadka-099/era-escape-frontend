import { useLogoutUser } from "@/services/loginService";
import { Modal, Typography } from "antd";
import PropTypes from "prop-types";

const LogoutConfirmModal = ({ isOpen = false, setIsOpen }) => {
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

LogoutConfirmModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};

export default LogoutConfirmModal;
