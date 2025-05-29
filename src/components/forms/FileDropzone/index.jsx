import { useState } from "react";
import { Upload, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const FileDropzone = ({
  acceptedFileTypes = ["image/jpeg", "image/png"], // Default to images only
  maxFiles = 0, // 0 means unlimited
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  multiple = true,
  onFilesChange = () => {},
}) => {
  const [fileList, setFileList] = useState([]);

  // Custom validation function
  const beforeUpload = (file) => {
    // Validate file type
    const isValidType = acceptedFileTypes.includes(file.type);
    if (!isValidType) {
      message.error(
        `Invalid file type! Accepted types: ${acceptedFileTypes
          .map((type) => type.split("/")[1])
          .join(", ")}`
      );
      return Upload.LIST_IGNORE;
    }

    // Validate file size
    const isUnderSizeLimit = file.size <= maxFileSize;
    if (!isUnderSizeLimit) {
      message.error(
        `File must be smaller than ${maxFileSize / (1024 * 1024)}MB!`
      );
      return Upload.LIST_IGNORE;
    }

    // Validate max files
    if (maxFiles > 0 && fileList.length >= maxFiles) {
      message.error(`Maximum ${maxFiles} files allowed!`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  // Handle file change
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    onFilesChange(newFileList);
  };

  // Remove file
  const handleRemove = (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    onFilesChange(newFileList);
    message.success(`${file.name} removed successfully`);
  };

  // Custom preview for images
  const uploadProps = {
    onRemove: handleRemove,
    beforeUpload,
    fileList,
    onChange: handleChange,
    multiple,
    listType: "picture", // Shows preview for images
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <DeleteOutlined onClick={(e) => e.stopPropagation()} />,
    },
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <Upload.Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file(s) to this area to upload
        </p>
        <p className="ant-upload-hint">
          Supports {multiple ? "multiple" : "single"} file upload. Accepted
          types:{" "}
          {acceptedFileTypes.map((type) => type.split("/")[1]).join(", ")}
          {maxFiles > 0 && ` | Max files: ${maxFiles}`}
          {` | Max size: ${maxFileSize / (1024 * 1024)}MB`}
        </p>
      </Upload.Dragger>
    </div>
  );
};

// PropTypes for type checking
FileDropzone.propTypes = {
  acceptedFileTypes: PropTypes.arrayOf(PropTypes.string),
  maxFiles: PropTypes.number,
  maxFileSize: PropTypes.number,
  multiple: PropTypes.bool,
  onFilesChange: PropTypes.func,
};

export default FileDropzone;
