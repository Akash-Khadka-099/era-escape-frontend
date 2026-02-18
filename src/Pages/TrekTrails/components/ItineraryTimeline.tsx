import React from "react";
import { Typography, Space, Button, Tag, Card } from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { FaBed } from "react-icons/fa";

interface RouteTime {
  timeToTravel: number;
  toPosition: [number, number];
  toTrailDestination: any;
}

interface Destination {
  position?: [number, number]; // latLong converted
  name: string | null;
  description: string | null;
  images: string[];
  locationKey?: string;
  slug: string | null;
  travelTimeToNext?: number;
  hasMultipleNextDestination?: boolean;
  routeTimes?: RouteTime[];
  elevation?: number;
  latLong?: string;
  facilities?: string[];
}

interface ItineraryTimelineProps {
  destinations: Destination[];
  onViewHotels: (slug: string) => void;
}

const { Title, Text, Paragraph } = Typography;

const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  destinations,
  onViewHotels,
}) => {
  if (!destinations || destinations.length === 0) return null;

  return (
    <div className="itinerary-timeline-container">
      <div style={{ marginBottom: "2rem" }}>
        <Title level={2}>Trek Trails and Destinations Details</Title>
      </div>

      <div className="timeline-wrapper" style={{ position: "relative" }}>
        {/* Vertical Line */}
        <div
          className="timeline-line"
          style={{
            position: "absolute",
            left: "20px",
            top: "20px",
            bottom: "20px",
            width: "2px",
            backgroundColor: "#e8e8e8", // Light gray
            borderLeft: "2px dashed #b7eb8f", // Green dashed line
            zIndex: 0,
          }}
        />

        {destinations.map((dest, index) => (
          <div
            key={index}
            className="timeline-item"
            style={{
              position: "relative",
              paddingLeft: "50px",
              marginBottom: "30px",
            }}
          >
            {/* Dot on Line */}
            <div
              className="timeline-dot"
              style={{
                position: "absolute",
                left: "14px",
                top: "24px",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#52c41a", // Green
                border: "3px solid #fff",
                boxShadow: "0 0 0 2px #52c41a",
                zIndex: 1,
              }}
            />

            {/* Card Content */}
            <Card
              bordered={false}
              className="itinerary-card"
              style={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                border: "1px solid #f0f0f0",
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <Title
                    level={4}
                    style={{ margin: 0, marginBottom: "0.5rem" }}
                  >
                    {dest.name}
                  </Title>
                  <Space size="middle" style={{ marginBottom: "1rem" }}>
                    {dest.elevation && (
                      <Tag
                        style={{
                          borderRadius: "30px",
                          background: "#fff",
                          border: "1px solid #e8e8e8",
                          color: "#595959",
                          padding: "4px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          margin: 0,
                        }}
                      >
                        <EnvironmentOutlined style={{ color: "#1890ff" }} />
                        <span style={{ fontWeight: 600 }}>
                          {dest.elevation}m
                        </span>
                      </Tag>
                    )}
                    {index === 0 && (
                      <Tag
                        style={{
                          borderRadius: "30px",
                          background: "#fff",
                          border: "1px solid #e8e8e8",
                          color: "#595959",
                          padding: "4px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          margin: 0,
                        }}
                      >
                        <ClockCircleOutlined style={{ color: "#fa8c16" }} />
                        <span style={{ fontWeight: 600 }}>Starting Point</span>
                      </Tag>
                    )}
                    {dest.travelTimeToNext && (
                      <Tag
                        style={{
                          borderRadius: "30px",
                          background: "#fff",
                          border: "1px solid #e8e8e8",
                          color: "#595959",
                          padding: "4px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          margin: 0,
                        }}
                      >
                        <ClockCircleOutlined style={{ color: "#1890ff" }} />
                        <span style={{ fontWeight: 600 }}>
                          ~{dest.travelTimeToNext} hrs to{" next destination"}
                        </span>
                      </Tag>
                    )}
                  </Space>
                </div>
                <div>
                  {dest.slug && (
                    <Button
                      type="default"
                      icon={<FaBed />}
                      onClick={() => onViewHotels(dest.slug!)}
                      style={{
                        borderRadius: "8px",
                        borderColor: "#52c41a",
                        color: "#52c41a",
                        fontWeight: 500,
                      }}
                    >
                      View Hotels
                    </Button>
                  )}
                </div>
              </div>

              {dest.description && (
                <Paragraph
                  type="secondary"
                  style={{
                    marginBottom: "1.5rem",
                    marginTop: "0.5rem",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  {dest.description}
                </Paragraph>
              )}

              {dest.facilities && dest.facilities.length > 0 && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {dest.facilities.map((facility, fIdx) => (
                    <Tag
                      key={fIdx}
                      style={{
                        borderRadius: "20px",
                        border: "none",
                        background: "#f0f2f5",
                        color: "#595959",
                        padding: "4px 12px",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      {facility}
                    </Tag>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryTimeline;
