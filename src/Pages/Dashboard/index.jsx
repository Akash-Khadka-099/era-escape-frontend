import AnimatedWelcomeText from "@/components/HomeAnimatedText/AnimatedWelcomeText";
import CardComponent from "@/Pages/Dashboard/CardTemplate";
import CategoryCard from "@/Pages/Dashboard/CategoryCard";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Carousel, Flex, Typography } from "antd";
import { useRef } from "react";
import Lottie from "react-lottie";
import TravelAnimation from "@/assets/JsonAnimation/travelAnimation.json";
import "animate.css";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import DashboardSearch from "@/components/DashboardSearch";

const cardData = [
  {
    title: "Kalinchowk",
    shortDescription:
      "Kalinchowk is a good , peace  and natural places based in relgious",
    imageSrc:
      "https://www.speedynepal.com/public/images/upload/package/slider/kalinchowk-speedy.jpg",
  },
  {
    title: "Gosaikunda",
    shortDescription:
      "Gpsaikunda is a good , peace  and natural places based in relgious",
    imageSrc:
      "https://aasraecotreks.com.np/wp-content/uploads/2018/10/Gosaikunda-lake.jpg",
  },
  {
    title: "Mustang",
    shortDescription:
      "Mustang is a good , peace  and natural places based in relgious",
    imageSrc:
      "https://res.klook.com/image/upload/c_fill,w_750,h_750/q_80/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/t8nn7dhvlof3gm7sjlm8.jpg",
  },
  {
    title: "Kalinchowk",
    shortDescription:
      "Kalinchowk is a good , peace  and natural places based in relgious",
    imageSrc:
      "https://www.speedynepal.com/public/images/upload/package/slider/kalinchowk-speedy.jpg",
  },
];

const categoryCardLists = [
  {
    title: "Mountains",
    imageSrc: "/images/mountain-home.png",
  },
  {
    title: "Religious",
    imageSrc: "/images/religion-home.jpg",
  },
  {
    title: "Lakes",
    imageSrc: "/images/lake-home.jpg",
  },
  {
    title: "Musuems",
    imageSrc: "/images/musuem.png",
  },
];
const Dashboard = () => {
  const carouselRef = useRef(null);

  const handleCarouselPrev = () => {
    carouselRef.current.prev();
  };

  const handleCarouselNext = () => {
    carouselRef.current.next();
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: TravelAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <Flex
        justifyContent={"space-between"}
        style={{
          background: "whitesmoke",
          width: "inherit",
        }}
      >
        <Flex
          vertical
          style={{ width: "100%" }}
          align="center"
          justify="center"
        >
          <AnimatedWelcomeText text="welcome to the world of Tour" />
          <div style={{ width: "500px" }}>
            <DashboardSearch />
          </div>
        </Flex>
        <div className={"py-2"} style={{ width: "50%" }}>
          <Lottie
            options={defaultOptions}
            height={500}
            style={{
              minHeight: 300,
            }}
          />
        </div>
      </Flex>

      <MiddleContentWrapper>
        <div className="my-5 bg-white fade-up-wrapper">
          <Flex justify="space-between" align={"center"}>
            <Typography.Title level={2}>
              {" "}
              Top Trending Packages
            </Typography.Title>
            <Button
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              type="primary"
            >
              View More
            </Button>
          </Flex>

          <div>
            <Carousel
              ref={carouselRef}
              arrows={true}
              slidesToShow={4}
              dots={false}
              draggable
            >
              {cardData?.map((item, index) => (
                <div className="my-2" key={index}>
                  <CardComponent
                    title={item?.title}
                    shortDescription={item?.shortDescription}
                    imageSrc={item?.imageSrc}
                  />
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
              />{" "}
            </Flex>
          </div>
        </div>
        <div className="my-5 fade-up-wrapper">
          <Flex justify="space-between" align={"center"}>
            <Typography.Title level={2}> Travel Categories </Typography.Title>
            <Button
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              type="primary"
            >
              View More
            </Button>
          </Flex>
          <Flex>
            {categoryCardLists?.map((item, index) => (
              <CategoryCard
                key={index}
                title={item?.title}
                imageSrc={item?.imageSrc}
              />
            ))}
          </Flex>
        </div>
      </MiddleContentWrapper>
    </>
  );
};

export default Dashboard;
