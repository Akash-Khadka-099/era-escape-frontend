import PackageCards from "@/components/Cards/PackageCards";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";

import { Col, Flex, Row } from "antd";

const featuresLists = ["Beautiful  views", "Peaceful gardens", "Discounts"];

const imageLists = [
  "https://www.speedynepal.com/public/images/upload/package/slider/kalinchowk-speedy.jpg",
  "https://www.greatnepaltreks.com/wp-content/uploads/2023/12/Screen-Shot-2023-12-15-at-22.02.10.png",
  "https://powertraveller.com/wp-content/uploads/2024/09/5_from-kathmandu-2-night-3-days-kalinchowk-snow-trek-2.jpg",
];

const Packages = () => {
  return (
    <>
      <MiddleContentWrapper>
        <Row gutter={16}>
          <Col span={6}>
            <div
              className="text-center"
              style={{
                minHeight: "100%",
                border: "1px solid rgba(0,0,0,0.3)",
                borderRadius: "8px",
              }}
            >
              Filters in this sections
            </div>
          </Col>
          <Col span={18}>
            <Flex vertical gap={20}>
              {Array.from({ length: 4 })?.map((_, index) => (
                <PackageCards
                  key={index}
                  rating={3}
                  imageLists={imageLists}
                  featuresLists={featuresLists}
                />
              ))}
            </Flex>
          </Col>
        </Row>
      </MiddleContentWrapper>
    </>
  );
};

export default Packages;
