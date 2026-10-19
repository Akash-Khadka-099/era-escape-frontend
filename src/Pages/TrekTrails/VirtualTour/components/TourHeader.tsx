import React from "react";
import { Button, Tag, Typography, Space, Tooltip } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { FaVrCardboard } from "react-icons/fa";

const { Title, Text } = Typography;

interface TourHeaderProps {
  trekName: string;
  region: string;
  destinationName: string;
  altitude: number;
  currentIndex: number;
  totalStops: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  infoPanelOpen: boolean;
  onToggleInfoPanel: () => void;
}

const TourHeader: React.FC<TourHeaderProps> = ({
  trekName,
  region,
  destinationName,
  altitude,
  currentIndex,
  totalStops,
  onClose,
  onNext,
  onPrev,
  isFullscreen,
  onToggleFullscreen,
  sidebarOpen,
  onToggleSidebar,
  infoPanelOpen,
  onToggleInfoPanel,
}) => {
  return (
    <header className="vt-header-bar" role="banner">
      {/* Left section: Title & presentation badge */}
      <div className="vt-header-left">
        <div className="vt-header-title-group">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <Title level={4} style={{ margin: 0, color: "#ffffff", fontSize: "16px", fontWeight: 700 }}>
              {trekName}
            </Title>
            <Tag
              icon={<FaVrCardboard style={{ marginRight: "4px", fontSize: "11px", color: "#5eead4" }} />}
              className="vt-tour-tag"
            >
              PRESENTATION • 360° TOUR
            </Tag>
          </div>

          <Text type="secondary" style={{ fontSize: "12px", color: "#94a3b8" }}>
            {region} • <span style={{ color: "#38bdf8", fontWeight: 600 }}>{destinationName}</span> ({altitude}m)
          </Text>
        </div>
      </div>

      {/* Center section: Slide progression stepper */}
      <div className="vt-header-center">
        <div className="vt-stepper-wrap">
          <button
            className="vt-stepper-btn"
            onClick={onPrev}
            disabled={currentIndex <= 0}
            title="Previous Stop (Left Arrow)"
          >
            <LeftOutlined style={{ fontSize: "12px" }} />
          </button>

          <span className="vt-stepper-label">
            Stop <span style={{ color: "#ffffff", fontWeight: 700 }}>{currentIndex + 1}</span> of {totalStops}
          </span>

          <button
            className="vt-stepper-btn"
            onClick={onNext}
            disabled={currentIndex >= totalStops - 1}
            title="Next Stop (Right Arrow)"
          >
            <RightOutlined style={{ fontSize: "12px" }} />
          </button>
        </div>
      </div>

      {/* Right section: View toggles & Prominent ESC / Close */}
      <div className="vt-header-right">
        <Space size="middle" align="center">
          <Tooltip title={sidebarOpen ? "Hide Route Stops" : "Show Route Stops"}>
            <Button
              type="text"
              icon={sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              onClick={onToggleSidebar}
              className={`vt-header-icon-btn ${sidebarOpen ? "active" : ""}`}
            />
          </Tooltip>

          <Tooltip title={infoPanelOpen ? "Hide Stop Details" : "Show Stop Details"}>
            <Button
              type="text"
              icon={<InfoCircleOutlined />}
              onClick={onToggleInfoPanel}
              className={`vt-header-icon-btn ${infoPanelOpen ? "active" : ""}`}
            />
          </Tooltip>

          <Tooltip title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}>
            <Button
              type="text"
              icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={onToggleFullscreen}
              className="vt-header-icon-btn"
            />
          </Tooltip>

          <div className="vt-header-divider" />

          {/* Prominent ESC / Close Pill Button */}
          <button
            className="vt-esc-exit-btn"
            onClick={onClose}
            title="Exit Presentation View (Press ESC)"
          >
            <kbd className="vt-esc-kbd">ESC</kbd>
            <span className="vt-exit-text">Exit Presentation</span>
            <CloseOutlined style={{ fontSize: "13px" }} />
          </button>
        </Space>
      </div>
    </header>
  );
};

export default TourHeader;
