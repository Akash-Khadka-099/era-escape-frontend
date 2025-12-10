import CustomConfirmationModal from "@/components/CustomConfirmationModal";
import { useDeleteFileMutation } from "@/services/fileServices";
import { PlusOutlined } from "@ant-design/icons";
import { Image, message, Modal, Upload } from "antd";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";

const CustomSingleImageUpload = ({
  imagePreviewSrc,
  imageId,
  onChange,
  onDeleteSuccessCall,
  ...props
}) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const { mutateAsync, isPending } = useDeleteFileMutation();

  const handleChange = ({ fileList }) => {
    // Allow only a single file
    const latestFile = fileList.slice(-1);
    setFileList(latestFile);
    onChange && onChange(latestFile[0]?.originFileObj);
  };

  const handlePreview = async (file) => {
    setPreviewImage(file.url || URL.createObjectURL(file.originFileObj));
    setPreviewVisible(true);
  };

  useEffect(() => {
    if (imagePreviewSrc) {
      setFileList([
        {
          name: "Uploaded Image",
          status: "done",
          url: `${import.meta.env.VITE_API_URL}/${imagePreviewSrc}`,
        },
      ]);
    }
  }, [imagePreviewSrc]);

  const onDeleteImageHandler = useCallback(async () => {
    if (imageId) {
      const deleteResponse = await mutateAsync(imageId);
      if (deleteResponse?.status == 200) {
        setOpenConfirmModal(false);
        setFileList([]);
        message.success("Image deleted successfully!");
        onDeleteSuccessCall();
      }
    }
  }, [imageId]);

  const handleCancel = () => setPreviewVisible(false);

  const beforeUpload = (file) => {
    const isImage =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isImage) {
      message.error("You can only upload image files (JPG, JPEG, PNG)!");

      return Upload.LIST_IGNORE;
    }
    return false;
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        onRemove={() => {
          if (imagePreviewSrc) {
            setOpenConfirmModal(true);
            return false;
          } else {
            setFileList([]);
          }
        }}
        maxCount={1}
        {...props}
      >
        {fileList.length >= 1 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      <Modal open={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
      <CustomConfirmationModal
        open={openConfirmModal}
        onCancel={() => setOpenConfirmModal(false)}
        onConfirm={onDeleteImageHandler}
        confirmText="Delete"
        confirmationLoading={isPending}
        title="Are you sure, you want to delete this image ?"
      >
        <Image
          style={{ maxWidth: "250px", maxHeight: "250px" }}
          preview={false}
          src={`${import.meta.env.VITE_API_URL}/${imagePreviewSrc}`}
        />
      </CustomConfirmationModal>
    </>
  );
};

CustomSingleImageUpload.propTypes = {
  onChange: PropTypes.func,
  imagePreviewSrc: PropTypes.string,
  imageId: PropTypes.string,
  onDeleteSuccessCall: PropTypes.func,
};
export default CustomSingleImageUpload;
