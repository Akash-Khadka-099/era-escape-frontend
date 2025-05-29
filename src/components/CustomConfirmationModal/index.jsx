import { Modal, Button, Flex } from "antd";
import PropTypes from "prop-types";

const CustomConfirmationModal = ({
  open,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  children,
  confirmText = "Yes, proceed",
  confirmationLoading = false,
  cancelText = "Cancel",
  confirmButtonProps = {},
  cancelButtonProps = {},
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} {...cancelButtonProps}>
          {cancelText}
        </Button>,
        <Button
          key="confirm"
          //   type="primary"
          variant="outlined"
          danger
          onClick={onConfirm}
          loading={confirmationLoading}
          {...confirmButtonProps}
        >
          {confirmText}
        </Button>,
      ]}
    >
      <Flex justify="center">{children}</Flex>
    </Modal>
  );
};

CustomConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmButtonProps: PropTypes.object,
  confirmationLoading: PropTypes.bool,
  cancelButtonProps: PropTypes.object,
};

export default CustomConfirmationModal;
