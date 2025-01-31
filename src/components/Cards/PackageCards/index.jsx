import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Carousel, Flex, Image, Rate, Typography } from "antd";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const PackageCards = ({ rating, imageLists = [], featuresLists = [] }) => {
  const [value, setValue] = useState(rating);

  const carouselRef = useRef(null);
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
        <Flex>
          <div
            className="tour-image-container p-1"
            style={{ position: "relative" }}
          >
            <Button
              shape="circle"
              size="small"
              icon={<LeftOutlined style={{ fontSize: 12 }} />}
              onClick={() => carouselRef.current.prev()}
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
              onClick={() => carouselRef.current.next()}
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
              {imageLists?.map((item, index) => (
                <>
                  <Image
                    key={index}
                    preview={false}
                    width={450}
                    height={280}
                    style={{ objectFit: "cover", borderRadius: "8px " }}
                    src={item}
                  />
                </>
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
              <Typography.Title level={4}>Kalinchowk</Typography.Title>
              <Flex gap="middle" vertical>
                <Rate tooltips={desc} onChange={setValue} value={value} />
              </Flex>
              <Typography.Text>1 Night 2 Days</Typography.Text>
            </div>
            <div>
              {featuresLists?.map((item) => (
                <div key={item}>
                  <IoIosCheckmarkCircle color="#41a831" />
                  <span className="px-2  text-secondary" style={{ fontSize: "14px" }}>
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
                Rs 2500
              </Typography.Title>
              <Button
                className="border-success"
                size="small"
                icon={<ArrowRightOutlined />}
                type="text"
                iconPosition="end"
              >
                More
              </Button>
            </Flex>
          </div>
        </Flex>
      </div>
    </>
  );
};

PackageCards.propTypes = {
  rating: PropTypes.number,
  imageLists: PropTypes.array,
  featuresLists: PropTypes.array,
};

export default PackageCards;
