import React from "react";
import { Card, CardProps } from "antd";

interface CustomCardProps extends CardProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
}

const CustomCard: React.FC<CustomCardProps> = ({ title, children, ...props }) => {
  return (
    <Card title={title} {...props}>
      {children}
    </Card>
  );
};

export default CustomCard;
