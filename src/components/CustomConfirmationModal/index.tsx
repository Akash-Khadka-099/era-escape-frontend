import React from "react";
import { Modal, Button, Flex, ButtonProps } from "antd";

interface CustomConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  children?: React.ReactNode;
  confirmText?: string;
  confirmationLoading?: boolean;
  cancelText?: string;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
}

const CustomConfirmationModal: React.FC<CustomConfirmationModalProps> = ({
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

export default CustomConfirmationModal;
