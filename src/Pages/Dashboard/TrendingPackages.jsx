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
  Select,
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

  const [period, setPeriod] = useState(1);

  const { data: trendingPackages } = useFetchTrendingPackages({ period });

  const getSlidesToShow = useCallback(() => {
    if (screens.xl) return 4;
    if (screens.lg) return 3;
    if (screens.md) return 2;
    if (screens.sm) return 1;
    if (screens.xs) return 1;
    return 4;
  }, [screens]);

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
          <Select
            defaultValue={1}
            style={{ width: 120 }}
            onChange={(value) => setPeriod(value)}
            options={[
              { value: 1, label: "1 month" },
              { value: 2, label: "2 months" },
              { value: 3, label: "3 months" },
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
          slidesToShow={Math.min(
            getSlidesToShow(),
            trendingPackages?.trending?.length || 1
          )}
          slidesToScroll={1}
        >
          {trendingPackages?.trending?.map((item, idx) => (
            <div key={idx}>
              <Row gutter={[16, 16]} justify="center">
                <Col span={24}>
                  <CardComponent
                    title={item?.title}
                    shortDescription={""}
                    imageSrc={`${BASE_URL}/${item?.packageProfileImage?.[0]?.path}`}
                    slug={item?.slug}
                  />
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
