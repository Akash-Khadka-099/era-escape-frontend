import React from "react";
import { Typography, Space, Tag } from "antd";
import {
  CompassOutlined,
  FieldTimeOutlined,
  EnvironmentOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { Trek } from "@/Pages/TrekTrails/VirtualTour/types";

const { Title, Text } = Typography;

interface TourSidebarProps {
  trek: Trek;
  activeIndex: number;
  onSelectDestination: (index: number) => void;
}

const TourSidebar: React.FC<TourSidebarProps> = ({
  trek,
  activeIndex,
  onSelectDestination,
}) => {
  return (
    <div className="vt-sidebar-inner">
      <div className="vt-sidebar-header">
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text type="secondary" style={{ textTransform: "uppercase", fontSize: 11, letterSpacing: "0.5px" }}>
              <CompassOutlined style={{ marginRight: 6 }} /> {trek.region}
            </Text>
            {trek.difficulty && (
              <Tag color="cyan" style={{ fontSize: 10, borderRadius: 10, margin: 0 }}>
                {trek.difficulty}
              </Tag>
            )}
          </div>
          <Title level={4} style={{ margin: "4px 0 0 0", color: "#f8fafc", fontSize: 16 }}>
            {trek.name}
          </Title>
          <Text type="secondary" style={{ fontSize: 12, color: "#94a3b8" }}>
            {trek.destinations.length} Key Trail Stops • Max {trek.maxAltitude}m
          </Text>
        </Space>
      </div>

      <div className="vt-sidebar-menu">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 6px" }}>
          <Text style={{ color: "#64748b", fontSize: 11, fontWeight: 700, letterSpacing: "1px" }}>
            TRAIL ROUTE STOPS
          </Text>
          <Text style={{ color: "#64748b", fontSize: 11 }}>
            {activeIndex + 1}/{trek.destinations.length}
          </Text>
        </div>

        {trek.destinations.map((dest, index) => {
          const isActive = index === activeIndex;
          const has360 = Boolean(dest.panoramicViews && dest.panoramicViews.length > 0);

          return (
            <div
              key={dest.slug || index}
              className={`vt-route-item ${isActive ? "active" : ""}`}
              onClick={() => onSelectDestination(index)}
              role="button"
              tabIndex={0}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div className={`vt-stop-index ${isActive ? "active" : ""}`}>
                  {isActive ? <CheckCircleFilled style={{ color: "#38bdf8" }} /> : index + 1}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 10, color: isActive ? "#38bdf8" : "#94a3b8", fontWeight: 700 }}>
                      STOP {dest.destinationPointerNumber || index + 1}
                    </Text>
                    {has360 && (
                      <span className="vt-360-pill">360°</span>
                    )}
                  </div>

                  <Text
                    strong
                    ellipsis
                    style={{
                      display: "block",
                      color: isActive ? "#ffffff" : "#cbd5e1",
                      fontSize: 14,
                      marginTop: 2,
                    }}
                  >
                    {dest.name}
                  </Text>

                  <Space size="middle" style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: 11, color: "#94a3b8" }}>
                      <EnvironmentOutlined /> {dest.altitude}m
                    </Text>
                    {dest.travelTimeFromPrevious !== null && dest.travelTimeFromPrevious > 0 && (
                      <Text type="secondary" style={{ fontSize: 11, color: "#94a3b8" }}>
                        <FieldTimeOutlined /> {dest.travelTimeFromPrevious}h
                      </Text>
                    )}
                  </Space>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TourSidebar;
