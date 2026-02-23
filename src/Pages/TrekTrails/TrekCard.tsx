import React from "react";
import { ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { FaMountain } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TrekCard.css";

interface TrekCardProps {
  id: string | number;
  title: string;
  days: number;
  elevation: string;
  description: string;
  images: string[];
  trekSlug: string;
}

const TrekCard: React.FC<TrekCardProps> = ({
  title,
  days,
  elevation,
  description,
  images,
  trekSlug,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/trek-trails/detail/${trekSlug}`);
  };

  const imageUrl = images?.[0]
    ? `${import.meta.env.VITE_API_URL}/${images[0]}`
    : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="trek-card" onClick={handleViewDetails}>
      <div className="trek-image-wrapper">
        <img src={imageUrl} alt={title} className="trek-image" loading="lazy" />
      </div>
      <div className="trek-info">
        <div className="trek-meta">
          <span>
            <ClockCircleOutlined /> {days || 0} DAYS
          </span>
          <span>•</span>
          <span>
            <EnvironmentOutlined /> NEPAL
          </span>
        </div>
        <h3 className="trek-card-title">{title}</h3>
        <p className="trek-card-desc">{description}</p>
        <div className="trek-card-footer">
          <span className="trek-stat">
            <FaMountain
              style={{ marginRight: "4px", color: "var(--primary-color)" }}
            />
            {elevation || "N/A"}M Altitude
          </span>
          <span
            className="read-story"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            DETAILS
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrekCard;
