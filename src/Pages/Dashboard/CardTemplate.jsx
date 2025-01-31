import { Button } from "antd";
import "./CardComponent.scss"; // Create this CSS file for custom styles
import PropTypes from "prop-types";

const CardComponent = ({ title, shortDescription, imageSrc }) => {
  return (
    <main className="d-flex flex-column justify-content-center align-items-center  ">
      <article className="card">
        <img
          className="card__background"
          // src="https://i.imgur.com/QYWAcXk.jpeg"
          src={imageSrc}
          alt="Photo of Cartagena's cathedral at the background and some colonial style houses"
          width="1920"
          height="2193"
        />
        <div className="card__content flow">
          <div className="card__content--container flow">
            <h2 className="card__title">{title}</h2>
            <p className="card__description">{shortDescription}</p>
          </div>
          <Button className="card__button">Read more</Button>
        </div>
      </article>
    </main>
  );
};

CardComponent.propTypes = {
  title: PropTypes.string,
  shortDescription: PropTypes.string,
  imageSrc: PropTypes.string,
};

export default CardComponent;
