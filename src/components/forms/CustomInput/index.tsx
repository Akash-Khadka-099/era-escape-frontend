import React from "react";
import { Input, InputNumber, InputProps, InputNumberProps } from "antd";
import { TextAreaProps } from "antd/es/input";

interface CustomInputProps {
  type?: "text" | "password" | "textarea" | "number"| "email";
  placeholder?: string;
  [key: string]: any;
}

const CustomInput: React.FC<CustomInputProps> = ({ type = "text", placeholder, ...props }) => {
 if (type == "number") {
   return  <InputNumber style={{width: "100%"}} placeholder={placeholder} {...props as InputNumberProps} />;
  }

  if (type == "password") {
   return  <Input.Password placeholder={placeholder} {...props as InputProps} />;
  }
  return (
    <>
      {type == "textarea" ? (
        <Input.TextArea  placeholder={placeholder} {...props as TextAreaProps} />
      ) : (
        <Input type={type} placeholder={placeholder} {...props as InputProps} />
      )}
    </>
  );
};

export default CustomInput;
