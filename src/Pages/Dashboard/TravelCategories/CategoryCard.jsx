import "./CategoryCard.scss";

import { Typography } from "antd";
import PropTypes from "prop-types";

const CategoryCard = ({ title, imageSrc }) => {
  return (
    <div className="category-card">
      <div
        className="category-bg"
        style={{
          background: `url(${imageSrc}) center/cover no-repeat`,
        }}
      ></div>
      <div className="category-overlay"></div>
      <div className="category-content">
        <Typography.Title
          level={3}
          style={{ textAlign: "center", color: "white" }}
        >
          {title}
        </Typography.Title>
      </div>
    </div>
  );
};

CategoryCard.propTypes = {
  title: PropTypes.string,
  imageSrc: PropTypes.string,
};

export default CategoryCard;
