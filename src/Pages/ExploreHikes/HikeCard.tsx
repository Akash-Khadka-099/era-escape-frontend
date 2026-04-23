import React from "react";
import { Card, Col, Flex, Row, Tag, Typography } from "antd";
import {
  ArrowRightOutlined,
  CompassOutlined,
  DeploymentUnitOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { FaMountain, FaRoute } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./HikeCard.css";

interface HikeCardProps {
  title: string;
  slug: string;
  difficulty?: string;
  maxAltitudeMeter?: number;
  trailDistanceKm?: number;
  shortSlogan?: string;
  featuredImagePath?: string;
  recommendedSeasons?: string[];
  hikeRegionName?: string;
  trailType?: string;
  isPicnic?: boolean;
}

const { Title, Text, Paragraph } = Typography;

const BASE_API_URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1200&auto=format&fit=crop";

const shellStyle: React.CSSProperties = {
  height: "100%",
  minHeight: 300,
  padding: 14,
  borderRadius: 34,
  border: "1px solid rgba(22, 37, 30, 0.08)",
  background:
    "radial-gradient(circle at top, rgba(255, 255, 255, 0.8), transparent 55%), linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 248, 242, 0.96) 100%)",
  boxShadow: "0 26px 60px rgba(18, 28, 24, 0.12)",
  overflow: "hidden",
};

const cardBodyStyle: React.CSSProperties = {
  padding: 0,
  height: "100%",
};

const mediaStyle: React.CSSProperties = {
  position: "relative",
  minHeight: 248,
  borderRadius: 26,
  overflow: "hidden",
  isolation: "isolate",
  boxShadow: "0 18px 36px rgba(11, 18, 16, 0.22)",
};

const difficultyTagStyle = (tone: string): React.CSSProperties => {
  const backgrounds: Record<string, string> = {
    easy: "rgba(77, 184, 122, 0.18)",
    medium: "rgba(243, 156, 18, 0.2)",
    hard: "rgba(220, 68, 55, 0.22)",
  };

  return {
    marginInlineEnd: 0,
    padding: "7px 13px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: backgrounds[tone] || "rgba(255,255,255,0.16)",
    color: "#f7faf8",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    backdropFilter: "blur(12px)",
  };
};

const regionTagStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  marginInlineEnd: 0,
  padding: "7px 11px",
  borderRadius: 999,
  border: "none",
  background: "rgba(10, 17, 15, 0.24)",
  color: "rgba(255, 250, 244, 0.9)",
  fontSize: 12,
  fontWeight: 600,
  backdropFilter: "blur(10px)",
};

const detailItemIconStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#214e39",
  fontSize: 13,
  flexShrink: 0,
};

const footerIconStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 42,
  height: 42,
  borderRadius: 999,
  background: "rgba(33, 78, 57, 0.08)",
};

const buildImageUrl = (imagePath?: string) => {
  if (!imagePath) {
    return FALLBACK_IMAGE;
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;
  return `${BASE_API_URL}${normalizedPath}`;
};

const formatTrailType = (value?: string) => {
  if (!value) {
    return "Scenic trail";
  }

  return value
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

const formatDistance = (value?: number) => {
  if (value === undefined || value === null) {
    return "Flexible";
  }

  return `${Number(value.toFixed(1))} km`;
};

const formatAltitude = (value?: number) => {
  if (value === undefined || value === null) {
    return "Altitude TBD";
  }

  return `${value.toLocaleString()} m`;
};

const HikeCard: React.FC<HikeCardProps> = ({
  title,
  slug,
  difficulty,
  maxAltitudeMeter,
  trailDistanceKm,
  shortSlogan,
  featuredImagePath,
  hikeRegionName,
  trailType,
  isPicnic,
}) => {
  const navigate = useNavigate();
  const difficultyLabel = difficulty || "Scenic";
  const difficultyTone = difficultyLabel.toLowerCase();
  const regionLabel = hikeRegionName || "Nepal";
  const slogan =
    shortSlogan ||
    (isPicnic
      ? "A breezy escape with viewpoints, picnic pauses, and a low-friction route."
      : "A cinematic Himalayan day hike with crisp air, textured climbs, and rewarding views.");
  const trailTypeLabel = trailType
    ? formatTrailType(trailType)
    : isPicnic
      ? "Picnic route"
      : "Scenic trail";

  const detailItems = [
    {
      value: formatDistance(trailDistanceKm),
      icon: <FaRoute />,
    },
    {
      value: formatAltitude(maxAltitudeMeter),
      icon: <FaMountain />,
    },
    {
      value: "3D Map",
      icon: <DeploymentUnitOutlined />,
    },
    {
      value: trailTypeLabel,
      icon: <CompassOutlined />,
    },
  ];

  const handleOpenDetails = () => {
    navigate(`/explore-hikes/detail/${slug}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenDetails();
    }
  };

  return (
    <article
      className="hike-card"
      onClick={handleOpenDetails}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${title}`}
    >
      <Card
        bordered={false}
        styles={{ body: cardBodyStyle }}
        className="hike-card__shell"
        style={shellStyle}
      >
        <div className="hike-card__media" style={mediaStyle}>
          <img
            src={buildImageUrl(featuredImagePath)}
            alt={title}
            className="hike-card__image"
            loading="lazy"
          />
          <div className="hike-card__overlay" />

          <Flex
            style={{ position: "absolute", top: 18, right: 18, zIndex: 1 }}
            align="center"
          >
            <Tag style={difficultyTagStyle(difficultyTone)}>
              {difficultyLabel}
            </Tag>
          </Flex>

          <Flex
            vertical
            gap={8}
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              bottom: 20,
              zIndex: 1,
            }}
          >
            <Title
              level={3}
              style={{
                margin: 0,
                maxWidth: "16ch",
                color: "#fffdf9",
                fontSize: "clamp(1.28rem, 1.8vw, 1.6rem)",
                lineHeight: 1.08,
              }}
            >
              {title}
            </Title>

            <Tag style={regionTagStyle} icon={<EnvironmentOutlined />}>
              {regionLabel}
            </Tag>
          </Flex>
        </div>

        <Flex vertical gap={14} className="hike-card__details">
          <Row gutter={8}>
            {detailItems?.map((item) => (
              <Col key={item.value} span={6}>
                <Flex gap={5}>
                  <span style={detailItemIconStyle}>{item.icon}</span>
                  <Text
                    style={{
                      color: "#516159",
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    {item.value}
                  </Text>
                </Flex>
              </Col>
            ))}
          </Row>

          <Paragraph
            style={{
              margin: 0,
              color: "#607067",
              fontSize: "0.95rem",
              lineHeight: 1.65,
            }}
          >
            {slogan}
          </Paragraph>

          <Flex
            align="center"
            justify="space-between"
            className="hike-card__details-extra "
            style={{ color: "#214e39" }}
          >
            <Text
              style={{
                color: "inherit",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Click for more details
            </Text>
            <span className="" style={footerIconStyle}>
              <ArrowRightOutlined />
            </span>
          </Flex>
        </Flex>
      </Card>
    </article>
  );
};

export default HikeCard;
