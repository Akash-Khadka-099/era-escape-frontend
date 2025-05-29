import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const CustomCkEditor = ({
  value,
  onChange,
  editor = ClassicEditor,
  ...rest
}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup editor instance on unmount
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.destroy().catch((error) => {
          console.error("Editor cleanup failed:", error);
        });
      }
    };
  }, []);
  return (
    <CKEditor
      editor={editor}
      data={value || ""}
      config={{
        licenseKey: "GPL",
        removePlugins: [
          "ImageUpload",
          "EasyImage",
          "CKFinder",
          "CKFinderUploadAdapter",
        ],
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "blockQuote",
          "|",
          "insertImage",
          "undo",
          "redo", // 'insertImage' still works via URL
        ],
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        if (typeof onChange === "function") {
          onChange(data);
        }
      }}
      onReady={(editor) => {
        // Ensure editor is fully initialized
        editorRef.current = { editor };
      }}
      {...rest}
    />
  );
};

CustomCkEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  editor: PropTypes.any,
};

export default CustomCkEditor;
