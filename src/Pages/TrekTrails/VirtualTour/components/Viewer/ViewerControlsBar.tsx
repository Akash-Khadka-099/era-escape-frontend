import React from "react";
import {
  LeftOutlined,
  RightOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  PictureOutlined,
  GlobalOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { ViewMode } from "@/Pages/TrekTrails/VirtualTour/types";

interface ViewerControlsBarProps {
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  onPrevStop: () => void;
  onNextStop: () => void;
  hasPrevStop: boolean;
  hasNextStop: boolean;
  hasUploaded360: boolean;
  hasGoogle360: boolean;
  hasVideo: boolean;
  onZoom: (inOut: "in" | "out") => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

/**
 * Floating toolbar anchored above the thumbnail strip for navigation, zoom, and mode switching.
 */
const ViewerControlsBar: React.FC<ViewerControlsBarProps> = ({
  viewMode,
  onSetViewMode,
  onPrevStop,
  onNextStop,
  hasPrevStop,
  hasNextStop,
  hasUploaded360,
  hasGoogle360,
  hasVideo,
  onZoom,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="vt-controls-bar" role="toolbar" aria-label="Viewer controls">
      {/* 1. Previous Trail Stop */}
      <button
        className="vt-control-btn"
        onClick={onPrevStop}
        disabled={!hasPrevStop}
        title="Previous Trail Stop"
        aria-label="Previous Stop"
      >
        <LeftOutlined />
      </button>

      {/* 2. Zoom In / Out (for 360 spherical mode) */}
      {viewMode === "360_uploaded" && (
        <>
          <button
            className="vt-control-btn"
            onClick={() => onZoom("in")}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomInOutlined />
          </button>
          <button
            className="vt-control-btn"
            onClick={() => onZoom("out")}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOutOutlined />
          </button>
        </>
      )}

      <div className="vt-control-separator" />

      {/* 3. Photo Mode Switcher */}
      <button
        className={`vt-control-btn ${viewMode === "image" ? "active" : ""}`}
        onClick={() => onSetViewMode("image")}
        title="Standard Photo View"
        aria-label="Standard Photo View"
      >
        <PictureOutlined />
      </button>

      {/* 4. Uploaded 360 Spherical Mode */}
      {hasUploaded360 && (
        <button
          className={`vt-control-btn ${
            viewMode === "360_uploaded" ? "active" : ""
          }`}
          onClick={() => onSetViewMode("360_uploaded")}
          title="360° Spherical View"
          aria-label="360 Spherical View"
        >
          <GlobalOutlined />
        </button>
      )}

      {/* 5. Google Maps Street View Mode */}
      {hasGoogle360 && (
        <button
          className={`vt-control-btn ${
            viewMode === "360_google" ? "active" : ""
          }`}
          onClick={() => onSetViewMode("360_google")}
          title="Google Maps Street View"
          aria-label="Google Maps Street View"
        >
          <span style={{ fontSize: "11px", fontWeight: 700 }}>STREET</span>
        </button>
      )}

      {/* 6. Video Mode Switcher */}
      {hasVideo && (
        <button
          className={`vt-control-btn ${viewMode === "video" ? "active" : ""}`}
          onClick={() => onSetViewMode("video")}
          title="Video Experience"
          aria-label="Video Experience"
        >
          <VideoCameraOutlined />
        </button>
      )}

      <div className="vt-control-separator" />

      {/* 7. Fullscreen Toggle */}
      <button
        className="vt-control-btn"
        onClick={onToggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        aria-label="Toggle Fullscreen"
      >
        {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </button>

      {/* 8. Next Trail Stop */}
      <button
        className="vt-control-btn"
        onClick={onNextStop}
        disabled={!hasNextStop}
        title="Next Trail Stop"
        aria-label="Next Stop"
      >
        <RightOutlined />
      </button>
    </div>
  );
};

export default React.memo(ViewerControlsBar);
