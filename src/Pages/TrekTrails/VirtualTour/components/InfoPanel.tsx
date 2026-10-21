import React from "react";
import { Typography, Row, Col, Card, Tag, Divider, Rate, Space } from "antd";
import {
  CloudOutlined,
  ArrowUpOutlined,
  SwapOutlined,
  WarningOutlined,
  RightOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import ElevationProfile from "@/Pages/TrekTrails/VirtualTour/components/ElevationProfile";
import { Destination } from "@/Pages/TrekTrails/VirtualTour/types";
import { buildImageUrl } from "@/utils/helper";

const { Title, Text, Paragraph } = Typography;

interface InfoPanelProps {
  destination: Destination;
  destinations?: Destination[];
  activeStopIndex?: number;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  destination,
  destinations = [],
  activeStopIndex = 0,
}) => {
  return (
    <div className="vt-infopanel-inner">
      {/* 1. Elevation Profile with animated active stop transition placed at the TOP */}
      {destinations && destinations.length > 0 && (
        <>
          <ElevationProfile
            destinations={destinations}
            activeIndex={activeStopIndex}
          />
          <Divider style={{ borderColor: "rgba(255, 255, 255, 0.1)", margin: "8px 0 20px 0" }} />
        </>
      )}

      {/* 2. Destination Title & Weather Tags */}
      <div style={{ marginBottom: 16 }}>
        <Title level={3} style={{ color: "#ffffff", margin: 0, fontSize: 20 }}>
          {destination.name}
        </Title>

        <Space size="middle" style={{ marginTop: 8, flexWrap: "wrap" }}>
          {destination.weather?.temperatureRange && (
            <Tag
              color="blue"
              icon={<CloudOutlined />}
              style={{
                border: "none",
                background: "rgba(56, 189, 248, 0.15)",
                color: "#38bdf8",
              }}
            >
              {destination.weather.temperatureRange.min} to{" "}
              {destination.weather.temperatureRange.max}
              {destination.weather.temperatureRange.unit}
            </Tag>
          )}

          <Text type="secondary" style={{ fontSize: 12, color: "#94a3b8" }}>
            <EnvironmentOutlined /> {destination.altitude}m ASL
          </Text>
        </Space>
      </div>

      {destination.description && (
        <Paragraph
          style={{
            color: "#cbd5e1",
            fontSize: 13,
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          {destination.description}
        </Paragraph>
      )}

      {/* 3. Distance & Altitude Stats */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card size="small" bordered={false} className="vt-info-stat-card">
            <Text type="secondary" style={{ fontSize: 10, textTransform: "uppercase" }}>
              <SwapOutlined /> Distance
            </Text>
            <Title level={4} style={{ color: "#ffffff", margin: "2px 0 0", fontSize: 16 }}>
              {destination.distanceFromPrevious || 0}{" "}
              <span style={{ fontSize: 11, fontWeight: "normal", color: "#94a3b8" }}>km</span>
            </Title>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" bordered={false} className="vt-info-stat-card">
            <Text type="secondary" style={{ fontSize: 10, textTransform: "uppercase" }}>
              <ArrowUpOutlined /> Elevation
            </Text>
            <Title level={4} style={{ color: "#ffffff", margin: "2px 0 0", fontSize: 16 }}>
              {destination.altitude}{" "}
              <span style={{ fontSize: 11, fontWeight: "normal", color: "#94a3b8" }}>m</span>
            </Title>
          </Card>
        </Col>
      </Row>

      {/* 4. Difficulty Rating */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          padding: "8px 12px",
          background: "rgba(255, 255, 255, 0.04)",
          borderRadius: 8,
        }}
      >
        <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Difficulty
        </Text>
        <Text
          style={{
            color:
              destination.difficultyRating === "Extreme"
                ? "#f87171"
                : destination.difficultyRating === "Challenging"
                ? "#fbbf24"
                : "#4ade80",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {destination.difficultyRating}{" "}
          {destination.difficultyRating === "Extreme" && <WarningOutlined />}
        </Text>
      </div>

      {/* 5. Available Facilities */}
      {destination.facilities && destination.facilities.length > 0 && (
        <>
          <Divider style={{ borderColor: "rgba(255, 255, 255, 0.1)", margin: "16px 0 12px 0" }} />
          <Title level={5} style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>
            AVAILABLE FACILITIES
          </Title>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {destination.facilities.map((fac, idx) => {
              const isObj = typeof fac === "object" && fac !== null;
              const isAvailable = isObj ? fac.available !== false : true;
              const icon = isObj ? fac.icon : "📍";
              const label = isObj ? fac.name : fac;

              return (
                <Tag
                  key={idx}
                  style={{
                    background: isAvailable ? "rgba(255, 255, 255, 0.08)" : "transparent",
                    border: isAvailable
                      ? "1px solid rgba(255, 255, 255, 0.15)"
                      : "1px dashed rgba(255, 255, 255, 0.1)",
                    color: isAvailable ? "#e2e8f0" : "#64748b",
                    padding: "4px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                >
                  {icon} {label}
                </Tag>
              );
            })}
          </div>
        </>
      )}

      {/* 6. Featured Lodges & Stays */}
      {destination.stays && destination.stays.length > 0 && (
        <>
          <Divider style={{ borderColor: "rgba(255, 255, 255, 0.1)", margin: "16px 0 12px 0" }} />
          <Title level={5} style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>
            FEATURED LODGES & STAYS
          </Title>
          {destination.stays.map((stay, idx) => (
            <Card
              key={idx}
              size="small"
              bordered={false}
              hoverable
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                marginBottom: 10,
                borderRadius: 8,
              }}
              bodyStyle={{
                padding: 8,
                display: "flex",
                width: "100%",
                gap: 10,
                alignItems: "center",
              }}
            >
              <img
                src={buildImageUrl(stay.image)}
                alt={stay.name}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 6,
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text strong ellipsis style={{ color: "#ffffff", display: "block", fontSize: 13 }}>
                  {stay.name}
                </Text>
                <Text type="secondary" style={{ fontSize: 11, display: "block", color: "#94a3b8" }}>
                  {stay.type} {stay.priceRange ? `• ${stay.priceRange}` : ""}
                </Text>
                <Rate
                  disabled
                  defaultValue={stay.rating}
                  style={{ fontSize: 9, color: "#facc15", margin: 0 }}
                />
              </div>
              <RightOutlined style={{ color: "#64748b", fontSize: 12 }} />
            </Card>
          ))}
        </>
      )}

      {/* 7. Local Tips */}
      {destination.tips && destination.tips.length > 0 && (
        <>
          <Divider style={{ borderColor: "rgba(255, 255, 255, 0.1)", margin: "16px 0 12px 0" }} />
          <Title level={5} style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>
            LOCAL TIPS
          </Title>
          <ul style={{ paddingLeft: 16, color: "#cbd5e1", margin: 0, fontSize: 12, lineHeight: "1.6" }}>
            {destination.tips.map((tip, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                {tip}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default InfoPanel;
