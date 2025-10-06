import "./Dashboard.css";
import AnimatedWelcomeText from "@/components/HomeAnimatedText/AnimatedWelcomeText";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import Lottie from "react-lottie";
import TravelAnimation from "@/assets/JsonAnimation/travelAnimation.json";
import "animate.css";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import DashboardSearch from "@/components/DashboardSearch";
import TrendingPackages from "./TrendingPackages";
import TravelCategories from "./TravelCategories/TravelCategories";

const Dashboard = () => {
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
        className="hero-container"
      >
        <Flex
          vertical
          style={{ width: "100%" }}
          align="center"
          justify="center"
          className="welcome-container"
        >
          <AnimatedWelcomeText text="welcome to the world of Tour" />
          <div className="search-destination">
            <DashboardSearch />
          </div>
        </Flex>
        <div className={"lottie-container"}>
          <Lottie options={defaultOptions} />
        </div>
      </Flex>

      <MiddleContentWrapper>
        <TrendingPackages />
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
          <TravelCategories />
        </div>
      </MiddleContentWrapper>
    </>
  );
};

export default Dashboard;
