import React, { useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CustomCkEditorProps {
  value?: string;
  onChange?: (data: string) => void;
  editor?: any;
  [key: string]: any;
}

const CustomCkEditor: React.FC<CustomCkEditorProps> = ({
  value,
  onChange,
  editor = ClassicEditor,
  ...rest
}) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      // Cleanup editor instance on unmount
      if (editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.destroy().catch((error: any) => {
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
      onChange={(_event: any, editor: any) => {
        const data = editor.getData();
        if (typeof onChange === "function") {
          onChange(data);
        }
      }}
      onReady={(editor: any) => {
        // Ensure editor is fully initialized
        editorRef.current = { editor };
      }}
      {...rest}
    />
  );
};

export default CustomCkEditor;
