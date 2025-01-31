import { Flex, Image, Typography } from "antd";
import PropTypes from "prop-types";

const CategoryCard = ({ title, imageSrc }) => {
  return (
    <>
      <div
        className="my-3  mx-4 p-2 shadow category-card"
        style={{
          height: "20rem",
          width: "20rem",
          background: "#fff",
          borderRadius: "8px",
        }}
      >
        <article>
          <Typography.Title
            level={3}
            style={{ textAlign: "center", color: "rgba(0,0,0,0.7)" }}
          >
            {title}
          </Typography.Title>
        </article>
        <Flex justify="center">
          <Image
            preview={false}
            src={imageSrc}
            width={250}
            height={250}
            style={{
              objectFit: "contain",

            }}
          />
        </Flex>
      </div>
    </>
  );
};

CategoryCard.propTypes = {
  title: PropTypes.string,
  imageSrc: PropTypes.string,
};

export default CategoryCard;
