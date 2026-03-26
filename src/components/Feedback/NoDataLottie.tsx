import React from "react";
import { Button, Flex, Typography } from "antd";
import Lottie from "react-lottie";
import NoDataFound from "@/assets/JsonAnimation/noDataFound.json";

const { Title, Text } = Typography;

interface NoDataLottieProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  height?: number;
  width?: number;
}

const noDataLottieOptions = {
  loop: true,
  autoplay: true,
  animationData: NoDataFound,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const NoDataLottie: React.FC<NoDataLottieProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  height = 300,
  width = 300,
}) => {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={8}
      style={{ width: "100%", minHeight: "320px" }}
    >
      <Lottie options={noDataLottieOptions} height={height} width={width} />
      <Title level={5} type="secondary" style={{ margin: 0 }}>
        {title}
      </Title>
      {description ? (
        <Text type="secondary" style={{ textAlign: "center" }}>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button type="primary" onClick={onAction} style={{ marginTop: 8 }}>
          {actionLabel}
        </Button>
      ) : null}
    </Flex>
  );
};

export default NoDataLottie;
