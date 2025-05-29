import { Input, InputNumber } from "antd";
import PropTypes from "prop-types";

const CustomInput = ({ type = "text", placeholder, ...props }) => {
 if (type == "number") {
   return  <InputNumber style={{width: "100%"}} placeholder={placeholder} {...props} />;
  }

  if (type == "password") {
   return  <Input.Password placeholder={placeholder} {...props} />;
  }
  return (
    <>
      {type == "textarea" ? (
        <Input.TextArea placeholder={placeholder} {...props} />
      ) : (
        <Input type={type} placeholder={placeholder} {...props} />
      )}
    </>
  );
};

CustomInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

export default CustomInput;
