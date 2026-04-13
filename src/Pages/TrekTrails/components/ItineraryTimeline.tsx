import React, { useState } from "react";
import { Typography, Space, Button, Tag, Card } from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { FaBed } from "react-icons/fa";
import parse from "html-react-parser";

interface RouteTime {
  timeToTravel: number;
  toPosition?: [number, number];
  toTrailDestination: any;
}

interface Destination {
  position?: [number, number]; // latLong converted
  name: string | null;
  description: string | null;
  images: string[];
  locationKey?: string;
  slug: string | null;
  travelTimeToNext?: number | string | null;
  hasMultipleNextDestination?: boolean;
  multipleDestinationRouteTime?: RouteTime[];
  routeTimes?: RouteTime[];
  elevation?: number;
  latLong?: string;
  facilities?: string[];
}

interface ItineraryTimelineProps {
  destinations: Destination[];
  onViewHotels: (slug: string) => void;
}

const { Title } = Typography;
const statusTagStyle: React.CSSProperties = {
  borderRadius: "30px",
  background: "#fff",
  border: "1px solid #e8e8e8",
  color: "#595959",
  padding: "4px 12px",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  margin: 0,
  maxWidth: "100%",
  height: "auto",
  lineHeight: 1.3,
  whiteSpace: "normal",
};

const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  destinations,
  onViewHotels,
}) => {
  const [activeDestinationIndex, setActiveDestinationIndex] = useState<
    number | null
  >(null);

  if (!destinations || destinations.length === 0) return null;

  const getMultipleRouteTimes = (dest: Destination): RouteTime[] => {
    if (!dest.hasMultipleNextDestination) return [];
    if (
      Array.isArray(dest.multipleDestinationRouteTime) &&
      dest.multipleDestinationRouteTime.length > 0
    ) {
      return dest.multipleDestinationRouteTime;
    }
    return Array.isArray(dest.routeTimes) ? dest.routeTimes : [];
  };

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

        {destinations.map((dest, index) => {
          const multiRouteTimes = getMultipleRouteTimes(dest);
          return (
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
              onMouseEnter={() => setActiveDestinationIndex(index)}
              onMouseLeave={() =>
                setActiveDestinationIndex((current) =>
                  current === index ? null : current,
                )
              }
              onFocus={() => setActiveDestinationIndex(index)}
              onBlur={() =>
                setActiveDestinationIndex((current) =>
                  current === index ? null : current,
                )
              }
              tabIndex={0}
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
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    {dest.name}
                  </Title>
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

              <Space size={[8, 8]} wrap style={{ marginBottom: "1rem", width: "100%" }}>
                {dest.elevation && (
                  <Tag style={statusTagStyle}>
                    <EnvironmentOutlined style={{ color: "#1890ff" }} />
                    <span style={{ fontWeight: 600 }}>{dest.elevation}m</span>
                  </Tag>
                )}
                {index === 0 && (
                  <Tag style={statusTagStyle}>
                    <ClockCircleOutlined style={{ color: "#fa8c16" }} />
                    <span style={{ fontWeight: 600 }}>Starting Point</span>
                  </Tag>
                )}
                {activeDestinationIndex === index && multiRouteTimes.length > 0
                  ? multiRouteTimes.map((rt, rtIndex) => (
                      <Tag
                        key={`${dest.slug || index}-${rtIndex}`}
                        style={statusTagStyle}
                      >
                        <ClockCircleOutlined style={{ color: "#1890ff" }} />
                        <span
                          style={{ fontWeight: 600, overflowWrap: "anywhere" }}
                        >
                          ~{rt?.timeToTravel} hrs to{" "}
                          {rt?.toTrailDestination?.name || "next destination"}
                        </span>
                      </Tag>
                    ))
                  : activeDestinationIndex === index &&
                      dest.travelTimeToNext !== null &&
                      dest.travelTimeToNext !== undefined && (
                        <Tag style={statusTagStyle}>
                          <ClockCircleOutlined style={{ color: "#1890ff" }} />
                          <span
                            style={{
                              fontWeight: 600,
                              overflowWrap: "anywhere",
                            }}
                          >
                            ~{dest.travelTimeToNext} hrs to next destination
                          </span>
                        </Tag>
                      )}
              </Space>

              {dest.description && (
                <div
                  className="timeline-description-html"
                  style={{
                    marginBottom: "1.5rem",
                    marginTop: "0.5rem",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#595959",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {parse(dest.description)}
                </div>
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
          );
        })}
      </div>
      <style>{`
        .timeline-description-html figure {
          margin: 0.5rem 0;
        }
        .timeline-description-html img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          display: block;
        }
        .timeline-description-html p {
          margin: 0 0 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default ItineraryTimeline;
