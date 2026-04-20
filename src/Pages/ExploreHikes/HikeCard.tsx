import React from "react";
import { EnvironmentOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { FaMountain, FaRoute, FaUmbrellaBeach } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./HikeCard.css";

interface HikeCardProps {
  title: string;
  slug: string;
  difficulty?: string;
  maxAltitudeMeter?: number;
  trailDistanceKm?: number;
  shortSlogan?: string;
  featuredImagePath?: string;
  recommendedSeasons?: string[];
  hikeRegionName?: string;
  isPicnic?: boolean;
}

const BASE_API_URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1200&auto=format&fit=crop";

const buildImageUrl = (imagePath?: string) => {
  if (!imagePath) {
    return FALLBACK_IMAGE;
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${BASE_API_URL}${normalizedPath}`;
};

const HikeCard: React.FC<HikeCardProps> = ({
  title,
  slug,
  difficulty,
  maxAltitudeMeter,
  trailDistanceKm,
  shortSlogan,
  featuredImagePath,
  recommendedSeasons,
  hikeRegionName,
  isPicnic,
}) => {
  const navigate = useNavigate();

  const handleOpenDetails = () => {
    navigate(`/explore-hikes/detail/${slug}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenDetails();
    }
  };

  return (
    <article
      className="hike-card"
      onClick={handleOpenDetails}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="hike-card__media">
        <img
          src={buildImageUrl(featuredImagePath)}
          alt={title}
          className="hike-card__image"
          loading="lazy"
        />
        <div className="hike-card__overlay" />
        <div className="hike-card__badges">
          {difficulty ? (
            <span className="hike-card__badge hike-card__badge--difficulty">
              {difficulty}
            </span>
          ) : null}
          {isPicnic ? (
            <span className="hike-card__badge hike-card__badge--picnic">
              <FaUmbrellaBeach />
              Picnic Spot
            </span>
          ) : null}
        </div>
        <div className="hike-card__headline">
          <p className="hike-card__eyebrow">Explore Hikes</p>
          <h3>{title}</h3>
          <p>{shortSlogan || "Scenic day-out routes with rewarding views."}</p>
        </div>
      </div>

      <div className="hike-card__body">
        <div className="hike-card__metrics">
          <span>
            <FaRoute />
            {trailDistanceKm ? `${trailDistanceKm} km` : "Distance TBD"}
          </span>
          <span>
            <FaMountain />
            {maxAltitudeMeter ? `${maxAltitudeMeter} m` : "Altitude TBD"}
          </span>
          <span>
            <EnvironmentOutlined />
            {hikeRegionName || "Nepal"}
          </span>
        </div>

        {recommendedSeasons?.length ? (
          <div className="hike-card__seasons">
            {recommendedSeasons.slice(0, 3).map((season) => (
              <span key={season}>{season}</span>
            ))}
          </div>
        ) : null}

        <div className="hike-card__footer">
          <span className="hike-card__footer-label">Open hike details</span>
          <ArrowRightOutlined />
        </div>
      </div>
    </article>
  );
};

export default HikeCard;
