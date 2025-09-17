import CustomInput from "@/components/forms/CustomInput";
import { useCreateDestination } from "@/services/destinationService";
import { Col, Form, message, Modal, Row } from "antd";
import PropTypes from "prop-types";

const AddDestinationModal = ({
  isModalOpen = false,
  setIsModalOpen,
  packageForm,
}) => {
  const [form] = Form.useForm();

  const packageSelectedDestination = Form.useWatch("destinations", packageForm);

  const { mutateAsync, isPending } = useCreateDestination();

  const onModalClose = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onSubmitHandler = async (values) => {
    try {
      const createDestination = await mutateAsync({
        ...values,
        organizationId: "68ca1bfaa2b05c76498f7028",
      });

      if (createDestination?.status == 201) {
        console.log("createDestination", createDestination);
        console.log("new id", createDestination?.data?.data?.id);
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
};

export default AddDestinationModal;
