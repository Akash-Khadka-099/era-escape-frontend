import React, { useState } from "react";
import {
  GlobalOutlined,
  PlayCircleOutlined,
  PictureOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import {
  Destination,
  ViewMode,
  PanoramicView,
  VideoItem,
  GalleryItem,
} from "@/Pages/TrekTrails/VirtualTour/types";

interface MediaThumbnailStripProps {
  destination: Destination;
  viewMode: ViewMode;
  activeMediaId: string;
  onSelectMedia: (mode: ViewMode, mediaId: string) => void;
}

/**
 * Panoramic 360 Thumbnail Card:
 * Displays spherical image if available; otherwise renders an interactive 360 radar graphic.
 */
const PanoThumbItem: React.FC<{
  pano: PanoramicView;
  isGoogle: boolean;
  isActive: boolean;
  onClick: () => void;
}> = ({ pano, isGoogle, isActive, onClick }) => {
  const [imgError, setImgError] = useState(false);
  // For Street View, or if thumbnail image is absent/broken, show the styled 360 sphere graphic
  const hasValidImage = !isGoogle && Boolean(pano.thumbnail) && !imgError;

  return (
    <div
      role="tab"
      aria-selected={isActive}
      className={`vt-media-thumb ${isActive ? "active" : ""}`}
      onClick={onClick}
      title={pano.title}
    >
      {hasValidImage ? (
        <img
          src={pano.thumbnail}
          alt={pano.title}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="vt-360-thumb-fallback">
          <div className="vt-360-thumb-sphere">
            <CompassOutlined className="vt-360-thumb-icon" />
            <span className="vt-360-thumb-badge">360°</span>
          </div>
        </div>
      )}
      <span className="category-label">
        <GlobalOutlined style={{ color: "#38bdf8" }} />{" "}
        {isGoogle ? "Street View" : "360° Sphere"}
      </span>
    </div>
  );
};

/**
 * Video Thumbnail Card with play badge and fallback.
 */
const VideoThumbItem: React.FC<{
  vid: VideoItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ vid, isActive, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const hasValidImage = Boolean(vid.thumbnail) && !imgError;

  return (
    <div
      role="tab"
      aria-selected={isActive}
      className={`vt-media-thumb ${isActive ? "active" : ""}`}
      onClick={onClick}
      title={vid.title}
    >
      {hasValidImage ? (
        <img
          src={vid.thumbnail}
          alt={vid.title}
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="vt-360-thumb-fallback"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(225, 29, 72, 0.4) 0%, rgba(10, 15, 29, 0.95) 75%)",
          }}
        >
          <PlayCircleOutlined style={{ fontSize: 22, color: "#f43f5e" }} />
        </div>
      )}
      <span className="category-label">
        <PlayCircleOutlined style={{ color: "#f43f5e" }} /> Video
      </span>
    </div>
  );
};

/**
 * Gallery Photo Thumbnail Card.
 */
const GalleryThumbItem: React.FC<{
  item: GalleryItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      role="tab"
      aria-selected={isActive}
      className={`vt-media-thumb ${isActive ? "active" : ""}`}
      onClick={onClick}
      title={item.caption}
    >
      {!imgError ? (
        <img
          src={item.thumbnail || item.src}
          alt={item.caption}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="vt-360-thumb-fallback">
          <PictureOutlined style={{ fontSize: 20, color: "#94a3b8" }} />
        </div>
      )}
      <span className="category-label">
        <PictureOutlined /> {item.category || "Photo"}
      </span>
    </div>
  );
};

/**
 * Bottom carousel strip of media thumbnails (360 scenes, Videos, Gallery images).
 * Displays rich category pill badges and active highlighting.
 */
const MediaThumbnailStrip: React.FC<MediaThumbnailStripProps> = ({
  destination,
  viewMode,
  activeMediaId,
  onSelectMedia,
}) => {
  return (
    <div className="vt-media-strip" role="tablist" aria-label="Media gallery thumbnails">
      {/* 1. Panoramic Views (Spherical 360 and Google Street View) */}
      {destination.panoramicViews?.map((pano, idx) => {
        const isGoogle = pano.type === "google_embed";
        const panoMode: ViewMode = isGoogle ? "360_google" : "360_uploaded";
        const mediaId = `pano_${idx}`;
        const isActive = viewMode === panoMode && activeMediaId === mediaId;

        return (
          <PanoThumbItem
            key={`pano-${pano.id || idx}`}
            pano={pano}
            isGoogle={isGoogle}
            isActive={isActive}
            onClick={() => onSelectMedia(panoMode, mediaId)}
          />
        );
      })}

      {/* 2. Videos */}
      {destination.videos?.map((vid, idx) => {
        const mediaId = `video_${idx}`;
        const isActive = viewMode === "video" && activeMediaId === mediaId;

        return (
          <VideoThumbItem
            key={`video-${vid.id || idx}`}
            vid={vid}
            isActive={isActive}
            onClick={() => onSelectMedia("video", mediaId)}
          />
        );
      })}

      {/* 3. Gallery Images */}
      {destination.gallery?.map((item, idx) => {
        const mediaId = `gallery_${idx}`;
        const isActive = viewMode === "image" && activeMediaId === mediaId;

        return (
          <GalleryThumbItem
            key={`gallery-${item.id || idx}`}
            item={item}
            isActive={isActive}
            onClick={() => onSelectMedia("image", mediaId)}
          />
        );
      })}
    </div>
  );
};

export default React.memo(MediaThumbnailStrip);
