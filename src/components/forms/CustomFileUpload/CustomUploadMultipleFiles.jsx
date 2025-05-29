import CustomConfirmationModal from "@/components/CustomConfirmationModal";
import { useDeleteFileMutation } from "@/services/fileServices";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Image, message, Tooltip, Upload } from "antd";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";

const CustomUploadMultipleFiles = ({
  setAcceptMultipleFiles,
  onDeleteSuccessCall,
  imageList = [],
}) => {
  const [deleteImageDetail, setDeleteImageDetail] = useState({
    imageId: null,
    imagePath: null,
  });
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(false);

  const { mutateAsync, isPending } = useDeleteFileMutation();

  const handleUploadChange = ({ fileList: newFileList }) => {
    const updatedFileList = newFileList.filter(
      (file) => file.status !== "error"
    );

    const fileConverter = updatedFileList?.map((item) => item?.originFileObj);
    setAcceptMultipleFiles(fileConverter);
  };
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error(`${file.name} is not an image file`);
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent automatic upload since we're handling it manually
  };

  const onDeleteImageHandler = useCallback(async () => {
    if (deleteImageDetail?.imageId) {
      const deleteResponse = await mutateAsync(deleteImageDetail?.imageId);
      if (deleteResponse?.status == 200) {
        setOpenConfirmModal(false);
        message.success("Image deleted successfully!");
        onDeleteSuccessCall();
      }
    }
  }, [deleteImageDetail]);

  return (
    <>
      <div className="my-4">
        <Image.PreviewGroup>
          <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
            {imageList.map((item) => (
              <div
                key={item?.id}
                style={{ position: "relative", width: 80, height: 80 }}
                onMouseEnter={() => setHoveredImage(item?.id)}
                onMouseLeave={() => setHoveredImage(false)}
              >
                <Image
                  width={80}
                  height={80}
                  src={`${import.meta.env.VITE_API_URL}/${item?.path}`}
                  style={{
                    objectFit: "cover",
                    borderRadius: 8, // optional, for better look
                  }}
                />
                {hoveredImage == item?.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "rgba(0,0,0,0.6)",
                      borderRadius: "50%",
                      padding: 4,
                      cursor: "pointer",
                    }}
                  >
                    <Tooltip title="Delete">
                      <DeleteOutlined
                        style={{ color: "white", fontSize: 18, zIndex: 10 }}
                        onClick={() => {
                          setOpenConfirmModal(true);
                          setDeleteImageDetail({
                            imageId: item?.id,
                            imagePath: item?.path,
                          });
                        }}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Image.PreviewGroup>
      </div>
      <Upload
        multiple
        accept="image/*"
        onChange={handleUploadChange}
        beforeUpload={beforeUpload}
        listType="picture"
        showUploadList={{
          showPreviewIcon: true,
          showRemoveIcon: true,
        }}
      >
        <Button icon={<UploadOutlined />}>Select Images</Button>
      </Upload>
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
          src={`${import.meta.env.VITE_API_URL}/${
            deleteImageDetail?.imagePath
          }`}
        />
      </CustomConfirmationModal>
    </>
  );
};

export default CustomUploadMultipleFiles;

CustomUploadMultipleFiles.propTypes = {
  setAcceptMultipleFiles: PropTypes.func,
  onDeleteSuccessCall: PropTypes.func,
  imageList: PropTypes.array,
};
