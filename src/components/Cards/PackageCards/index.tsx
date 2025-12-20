import React, { useMemo, useRef, useState } from "react";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Badge, Button, Carousel, Flex, Image, Rate, Typography } from "antd";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

interface PackageCardsProps {
  rating?: number;
  packageDetail: any;
  featuresLists?: string[];
}

const PackageCards: React.FC<PackageCardsProps> = ({ rating, packageDetail, featuresLists = [] }) => {
  const [value, setValue] = useState(rating);

  const navigate = useNavigate();

  const imagesPath = useMemo(() => {
    const otherImages = packageDetail?.images?.map((item: any) => item?.path);

    return [packageDetail?.profileImage?.path, ...(otherImages || [])];
  }, [packageDetail]);
  const packagePrices = useMemo(() => {
    return packageDetail?.prices?.find((item: any) => item?.country == "nepal");
  }, [packageDetail]);

  const carouselRef = useRef<any>(null);
  return (
    <>
      {" "}
      <div
        className="fade-up-wrapper hoverable-wrapper "
        style={{
          background: "white",
          borderRadius: "8px",
          cursor: "pointer",
          width: "clamp(800px, 1000px, 1000px)",
        }}
      >
        <Badge.Ribbon
          text={
            packagePrices?.discountPercent
              ? `Discount ${packagePrices?.discountPercent}%`
              : null
          }
          color="green"
          style={!packagePrices?.discountPercent ? { display: "none" } : {}}
        >
          <Flex>
            <div
              className="tour-image-container p-1"
              style={{ position: "relative" }}
            >
              <Button
                shape="circle"
                size="small"
                icon={<LeftOutlined style={{ fontSize: 12 }} />}
                onClick={() => carouselRef.current?.prev()}
                style={{
                  background: "whitesmoke",
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translatey(-50%)",
                  zIndex: 1,
                }}
              />
              <Button
                shape="circle"
                size="small"
                icon={<RightOutlined style={{ fontSize: 12 }} />}
                onClick={() => carouselRef.current?.next()}
                style={{
                  background: "whitesmoke",
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translatey(-50%)",
                  zIndex: 1,
                }}
              />
              <Carousel
                ref={carouselRef}
                dots={false}
                autoplay
                style={{
                  maxWidth: "450px",
                  maxHeight: "280px",
                  borderRadius: "8px",
                }}
              >
                {imagesPath?.map((item: string, index: number) => (
                  <React.Fragment key={index}>
                    <Image
                      preview={false}
                      width={450}
                      height={280}
                      style={{ objectFit: "cover", borderRadius: "8px " }}
                      src={`${import.meta.env.VITE_API_URL}/${item}`}
                    />
                  </React.Fragment>
                ))}
              </Carousel>
            </div>
            <div
              className="p-3"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <div>
                <Typography.Title level={4}>
                  {packageDetail?.title}
                </Typography.Title>
                <Flex gap="middle" vertical>
                  <Rate tooltips={desc} onChange={setValue} value={value} />
                </Flex>
                <Typography.Text>
                  {packageDetail?.totalNights} Night{" "}
                  {packageDetail?.totalNights + 1} Days
                </Typography.Text>
              </div>
              <div>
                {featuresLists?.map((item) => (
                  <div key={item}>
                    <IoIosCheckmarkCircle color="#41a831" />
                    <span
                      className="px-2  text-secondary"
                      style={{ fontSize: "14px" }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <Flex justify="space-between">
                <Typography.Title
                  level={4}
                  style={{ fontWeight: "600", color: "rgba(0,0,0,0.6)" }}
                >
                  Rs {packagePrices?.price}
                </Typography.Title>
                <Button
                  className="border-success"
                  size="small"
                  icon={<ArrowRightOutlined />}
                  type="text"
                  iconPosition="end"
                  onClick={() =>
                    navigate(`/package-details/${packageDetail?.slug}`)
                  }
                >
                  Details
                </Button>
              </Flex>
            </div>
          </Flex>
        </Badge.Ribbon>
      </div>
    </>
  );
};

export default PackageCards;
