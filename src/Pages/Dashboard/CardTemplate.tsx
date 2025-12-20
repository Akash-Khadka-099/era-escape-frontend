import React from "react";
import { Button } from "antd";
import "./CardComponent.scss"; // Create this CSS file for custom styles
import { useNavigate } from "react-router-dom";

interface CardComponentProps {
  title: string;
  shortDescription: string;
  imageSrc: string;
  slug: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ title, shortDescription, imageSrc, slug }) => {
  const navigate = useNavigate();
  return (
    <main className="d-flex flex-column justify-content-center align-items-center  ">
      <article className="card">
        <img
          className="card__background"
          // src="https://i.imgur.com/QYWAcXk.jpeg"
          src={imageSrc}
          alt={title}
          width="1920"
          height="2193"
        />
        <div className="card__content flow">
          <div className="card__content--container flow">
            <h2 className="card__title">{title}</h2>
            <p className="card__description">{shortDescription}</p>
          </div>
          <Button
            onClick={() => navigate(`/package-details/${slug}`)}
            className="card__button"
          >
            View Detail
          </Button>
        </div>
      </article>
    </main>
  );
};

export default CardComponent;
