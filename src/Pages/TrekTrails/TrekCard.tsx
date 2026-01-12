import React, { useRef } from "react";
import { Card, Typography, Button, Carousel } from "antd";
import { FaClock, FaMountain } from "react-icons/fa";
import {
  LeftOutlined,
  RightOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

interface TrekCardProps {
  id: string | number;
  title: string;
  days: number;
  elevation: string;
  description: string;
  images: string[];
  trekSlug: string
}

const TrekCard: React.FC<TrekCardProps> = ({
  title,
  days,
  elevation,
  description,
  images,
  trekSlug
}) => {
  const navigate = useNavigate();
  const carouselRef = useRef<any>(null);

  const handleViewDetails = () => {
    // Navigate to the detail page (currently using the same detail page for all)
    navigate(`/trek-trails/detail/${trekSlug}`);
  };

  return (
    <Card
      hoverable
      style={{
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        border: "none",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      bodyStyle={{
        padding: "20px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
      cover={
        <div
          style={{
            position: "relative",
            height: "240px",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Button
            shape="circle"
            size="small"
            icon={<LeftOutlined style={{ fontSize: 12 }} />}
            onClick={(e) => {
              e.stopPropagation();
              carouselRef.current?.prev();
            }}
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          />
          <Button
            shape="circle"
            size="small"
            icon={<RightOutlined style={{ fontSize: 12 }} />}
            onClick={(e) => {
              e.stopPropagation();
              carouselRef.current?.next();
            }}
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          />
          <Carousel
            ref={carouselRef}
            autoplay
            dots={false}
            effect="fade"
            style={{ height: "100%", width: "100%" }}
          >
            {images.map((img, index) => (
              <div key={index} style={{ height: "240px", width: "100%" }}>
                <img
                  src={`${import.meta.env.VITE_API_URL}/${img}`}
                  alt={title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </Carousel>
        </div>
      }
    >
      <div style={{ marginBottom: "12px" }}>
        <Title
          level={4}
          style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "bold" }}
        >
          {title}
        </Title>
        <div
          style={{
            display: "flex",
            gap: "16px",
            color: "#666",
            fontSize: "13px",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FaClock style={{ color: "#52c41a" }} /> {days} Days
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FaMountain style={{ color: "#52c41a" }} /> {elevation}m
          </span>
        </div>
      </div>

      <Paragraph
        ellipsis={{ rows: 2 }}
        style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "20px",
          flex: 1,
        }}
      >
        {description}
      </Paragraph>

      <Button
        block
        style={{
          backgroundColor: "#e6f7e9",
          color: "#000",
          border: "none",
          fontWeight: "500",
          height: "40px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        onClick={handleViewDetails}
      >
        View Details <ArrowRightOutlined style={{ fontSize: "12px" }} />
      </Button>
    </Card>
  );
};

export default TrekCard;
