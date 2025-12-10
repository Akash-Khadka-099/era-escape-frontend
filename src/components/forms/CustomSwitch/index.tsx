import React from "react";
import { Switch, SwitchProps } from "antd";

const CustomSwitch: React.FC<SwitchProps> = ({ ...props }) => {
  return (
    <>
      <Switch {...props} />
    </>
  );
};

export default CustomSwitch;
