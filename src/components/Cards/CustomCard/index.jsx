import { Card } from "antd";
import PropTypes from "prop-types";

const CustomCard = ({ title, children, ...props }) => {
  return (
    <Card title={title} {...props}>
      {children}
    </Card>
  );
};

CustomCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default CustomCard;
