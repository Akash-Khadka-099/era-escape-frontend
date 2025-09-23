import CustomInput from "@/components/forms/CustomInput";
import { useCreateDestination } from "@/services/destinationService";
import useAuthStore from "@/store/authStore";
import { Col, Form, message, Modal, Row } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";

const AddDestinationModal = ({
  isModalOpen = false,
  setIsModalOpen,
  packageForm,
  setSearchedDestination,
  searchedDestination,
}) => {
  const [form] = Form.useForm();
  const { user } = useAuthStore();

  const packageSelectedDestination = Form.useWatch("destinations", packageForm);

  const { mutateAsync, isPending } = useCreateDestination();

  const onModalClose = () => {
    form.resetFields();
    setIsModalOpen(false);
    setSearchedDestination("");
  };

  const onSubmitHandler = async (values) => {
    try {
      const createDestination = await mutateAsync({
        ...values,
        organizationId: user?.organizationId,
      });

      if (createDestination?.status == 201) {
        packageForm.setFieldValue("destinations", [
          ...packageSelectedDestination,
          createDestination?.data?.data?.id,
        ]);
        message.success("Created successfully");
        onModalClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({ title: searchedDestination });
    }
  }, [isModalOpen, form, searchedDestination]);

  return (
    <>
      <Modal
        width={"700px"}
        open={isModalOpen}
        onCancel={onModalClose}
        title={"Add Destination"}
        okText={"Submit"}
        okButtonProps={{
          form: "destination-form",
          htmlType: "submit",
          loading: isPending,
        }}
      >
        <Form
          id="destination-form"
          form={form}
          layout="vertical"
          onFinish={onSubmitHandler}
        >
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Form.Item
                name={"title"}
                label={"Title"}
                rules={[
                  {
                    required: true,
                    message: "Title is required",
                  },
                ]}
              >
                <CustomInput />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"location"}
                label={"Location"}
                rules={[
                  {
                    required: true,
                    message: "Location is required",
                  },
                ]}
              >
                <CustomInput
                  placeholder={"Enter a District or famous places "}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

AddDestinationModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  packageForm: PropTypes.any,
  setSearchedDestination: PropTypes.func,
  searchedDestination: PropTypes.string,
};

export default AddDestinationModal;
