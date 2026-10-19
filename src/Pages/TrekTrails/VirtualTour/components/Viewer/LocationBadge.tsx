import React from "react";
import { EnvironmentOutlined } from "@ant-design/icons";

interface LocationBadgeProps {
  name: string;
  altitude: number;
}

/**
 * Centered floating location badge displaying the active trail stop and elevation.
 * Positioned at the top-center to comply with Google Maps Street View branding requirements.
 */
const LocationBadge: React.FC<LocationBadgeProps> = ({ name, altitude }) => {
  return (
    <div className="vt-location-badge">
      <EnvironmentOutlined style={{ color: "#38bdf8" }} />
      <span>{name}</span>
      <span style={{ opacity: 0.6 }}>•</span>
      <span style={{ fontSize: "12px", color: "#94a3b8" }}>{altitude}m</span>
    </div>
  );
};

export default React.memo(LocationBadge);
