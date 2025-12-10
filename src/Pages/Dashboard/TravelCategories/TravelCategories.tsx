import React from "react";
import CategoryCard from "@/Pages/Dashboard/TravelCategories/CategoryCard";
import { Col, Row } from "antd";

const categoryCardLists = [
  {
    title: "Mountains",
    imageSrc:
      "https://images.pexels.com/photos/1315638/pexels-photo-1315638.jpeg", // TODO: download locally?
  },
  {
    title: "Religious",
    imageSrc:
      "https://images.pexels.com/photos/16330656/pexels-photo-16330656.jpeg",
  },
  {
    title: "Lakes",
    imageSrc:
      "https://images.pexels.com/photos/12798506/pexels-photo-12798506.jpeg",
  },
  {
    title: "Musuems",
    imageSrc:
      "https://images.pexels.com/photos/34136622/pexels-photo-34136622.jpeg",
  },
];

const TravelCategories: React.FC = () => {
  return (
    <Row gutter={[16, 16]}>
      {categoryCardLists?.map((item, index) => (
        <Col key={index} xs={24} sm={12}>
          <CategoryCard title={item?.title} imageSrc={item?.imageSrc} />
        </Col>
      ))}
    </Row>
  );
};

export default TravelCategories;
