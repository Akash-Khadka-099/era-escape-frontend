import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import HeroImage from "@/assets/images/hero.png";
import "./CategoryCard.css";

interface CategoryCardProps {
  category: {
    id: string;
    title: string;
    slug: string;
    profileImage?: {
      path: string;
    };
    description?: string;
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="landscape-card">
      <div className="landscape-image-wrapper">
        <img
          src={
            category.profileImage
              ? `${import.meta.env.VITE_API_URL}/${category.profileImage?.path}`
              : HeroImage
          }
          alt={category.title}
          className="landscape-image"
        />
        <div className="landscape-overlay"></div>
      </div>
      <div className="landscape-content">
        <h3 className="landscape-title">{category.title}</h3>
        <div className="landscape-hover-content">
          <Link
            to={`/trek-trails?category=${category.title}`}
            className="explore-btn"
          >
            Explore Trail <ArrowRightOutlined />
          </Link>
          <p className="landscape-desc">{category.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
