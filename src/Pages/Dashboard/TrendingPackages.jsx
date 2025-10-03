import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Button,
  Carousel,
  Col,
  Flex,
  Grid,
  Row,
  Segmented,
  Typography,
} from "antd";
import { useCallback, useRef, useState } from "react";
import CardComponent from "./CardTemplate";
import { useFetchTrendingPackages } from "@/services/packageService";

const { useBreakpoint } = Grid;
const BASE_URL = import.meta.env.VITE_API_URL;

const TrendingPackages = () => {
  const carouselRef = useRef(null);
  const screens = useBreakpoint();

  console.log("screens here", screens);

  const [period, setPeriod] = useState(1);

  const { data: trendingPackages } = useFetchTrendingPackages({ period });

  const getSlidesToShow = useCallback(() => {
    if (screens.xxl) return 4;
    if (screens.lg) return 3;
    if (screens.md) return 2;
    if (screens.sm) return 1;
    if (screens.xs) return 1;
    return 4;
  }, [screens]);

  console.log("getSlidesToShow", getSlidesToShow());

  const handleCarouselPrev = () => {
    carouselRef.current.prev();
  };

  const handleCarouselNext = () => {
    carouselRef.current.next();
  };

  return (
    <div className="my-5 bg-white fade-up-wrapper">
      <Flex justify="space-between" align={"center"}>
        <Typography.Title level={2}>Top Trending Packages</Typography.Title>
        <Flex gap={12}>
          <Segmented
            value={period}
            style={{ marginBottom: 8, padding: "6px" }}
            onChange={setPeriod}
            options={[
              {
                value: "1",
                label: "30 Days",
              },
              {
                value: "2",
                label: "60 Days",
              },
              {
                value: "3",
                label: "90 Days",
              },
            ]}
          />

          <Button
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            type="primary"
          >
            View More
          </Button>
        </Flex>
      </Flex>

      <div className="mt-3">
        <Carousel
          ref={carouselRef}
          arrows
          dots={false}
          draggable
          adaptiveHeight
          slidesToShow={getSlidesToShow()}
          slidesToScroll={1}
        >
          {trendingPackages?.trending?.map((item, idx) => (
            <div key={idx}>
              <Row gutter={[16, 16]} justify="center">
                <Col span={24}>
                  <div className="my-4">
                    <CardComponent
                      title={item?.title}
                      shortDescription={""}
                      imageSrc={`${BASE_URL}/${item?.packageProfileImage?.[0]?.path}`}
                      slug={item?.slug}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </Carousel>
        <Flex className="my-3 mx-5" justify="end" gap={16}>
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            onClick={handleCarouselPrev}
          />
          <Button
            shape="circle"
            icon={<RightOutlined />}
            onClick={handleCarouselNext}
          />
        </Flex>
      </div>
    </div>
  );
};

export default TrendingPackages;
