import React from "react";
import "./CategoryCard.scss";
import { Typography } from "antd";

interface CategoryCardProps {
  title: string;
  imageSrc: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageSrc }) => {
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

export default CategoryCard;


