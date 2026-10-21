import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Destination, ViewMode } from "@/Pages/TrekTrails/VirtualTour/types";
import LocationBadge from "@/Pages/TrekTrails/VirtualTour/components/Viewer/LocationBadge";
import PhotoStage from "@/Pages/TrekTrails/VirtualTour/components/Viewer/PhotoStage";
import Spherical360Viewer from "@/Pages/TrekTrails/VirtualTour/components/Viewer/Spherical360Viewer";
import GoogleStreetViewEmbed from "@/Pages/TrekTrails/VirtualTour/components/Viewer/GoogleStreetViewEmbed";
import VideoStage from "@/Pages/TrekTrails/VirtualTour/components/Viewer/VideoStage";
import MediaThumbnailStrip from "@/Pages/TrekTrails/VirtualTour/components/Viewer/MediaThumbnailStrip";
import ViewerControlsBar from "@/Pages/TrekTrails/VirtualTour/components/Viewer/ViewerControlsBar";

interface MainViewerProps {
  destination: Destination;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Main Stage Orchestrator:
 * Manages active media selection, displays images, 360° panoramas, Street View, and videos,
 * coordinates bottom thumbnails, and controls toolbar actions.
 */
const MainViewer: React.FC<MainViewerProps> = ({
  destination,
  viewMode,
  setViewMode,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  const psvRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMediaId, setActiveMediaId] = useState<string>("featured");

  // Availability indicators
  const hasUploaded360 = useMemo(
    () => destination.panoramicViews?.some((v) => v.type === "uploaded_360") ?? false,
    [destination.panoramicViews],
  );

  const hasGoogle360 = useMemo(
    () => destination.panoramicViews?.some((v) => v.type === "google_embed") ?? false,
    [destination.panoramicViews],
  );

  const hasVideo = useMemo(
    () => (destination.videos?.length ?? 0) > 0,
    [destination.videos],
  );

  // Automatically select the most immersive media when destination changes
  useEffect(() => {
    if (destination.panoramicViews && destination.panoramicViews.length > 0) {
      const firstPano = destination.panoramicViews[0];
      if (firstPano.type === "uploaded_360") {
        setViewMode("360_uploaded");
        setActiveMediaId("pano_0");
      } else {
        setViewMode("360_google");
        setActiveMediaId("pano_0");
      }
    } else if (hasVideo) {
      setViewMode("video");
      setActiveMediaId("video_0");
    } else if (destination.gallery && destination.gallery.length > 0) {
      setViewMode("image");
      setActiveMediaId("gallery_0");
    } else {
      setViewMode("image");
      setActiveMediaId("gallery_0");
    }
  }, [destination, setViewMode, hasVideo]);

  // Resolve current active media assets based on viewMode and activeMediaId
  const currentImageSrc = useMemo(() => {
    if (activeMediaId.startsWith("gallery_")) {
      const idx = parseInt(activeMediaId.split("_")[1], 10);
      return (
        destination.gallery?.[idx]?.src ||
        destination.gallery?.[0]?.src ||
        destination.featuredImage
      );
    }
    return destination.gallery?.[0]?.src || destination.featuredImage;
  }, [activeMediaId, destination]);

  const currentUploaded360 = useMemo(() => {
    if (activeMediaId.startsWith("pano_")) {
      const idx = parseInt(activeMediaId.split("_")[1], 10);
      const pano = destination.panoramicViews?.[idx];
      if (pano && pano.type === "uploaded_360") return pano;
    }
    return destination.panoramicViews?.find((v) => v.type === "uploaded_360") || null;
  }, [activeMediaId, destination.panoramicViews]);

  const currentGoogle360 = useMemo(() => {
    if (activeMediaId.startsWith("pano_")) {
      const idx = parseInt(activeMediaId.split("_")[1], 10);
      const pano = destination.panoramicViews?.[idx];
      if (pano && pano.type === "google_embed") return pano;
    }
    return destination.panoramicViews?.find((v) => v.type === "google_embed") || null;
  }, [activeMediaId, destination.panoramicViews]);

  const currentVideo = useMemo(() => {
    if (activeMediaId.startsWith("video_")) {
      const idx = parseInt(activeMediaId.split("_")[1], 10);
      return destination.videos?.[idx] || destination.videos?.[0] || null;
    }
    return destination.videos?.[0] || null;
  }, [activeMediaId, destination.videos]);

  // Media selection handler from thumbnail strip
  const handleSelectMedia = useCallback(
    (mode: ViewMode, mediaId: string) => {
      setViewMode(mode);
      setActiveMediaId(mediaId);
    },
    [setViewMode],
  );

  // Switch view mode via controls bar
  const handleSetViewMode = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
      if (mode === "image") {
        if (!activeMediaId.startsWith("gallery_")) {
          setActiveMediaId(destination.gallery?.length ? "gallery_0" : "featured");
        }
      } else if (mode === "360_uploaded") {
        const firstIdx = destination.panoramicViews?.findIndex(
          (v) => v.type === "uploaded_360",
        );
        setActiveMediaId(`pano_${firstIdx >= 0 ? firstIdx : 0}`);
      } else if (mode === "360_google") {
        const firstIdx = destination.panoramicViews?.findIndex(
          (v) => v.type === "google_embed",
        );
        setActiveMediaId(`pano_${firstIdx >= 0 ? firstIdx : 0}`);
      } else if (mode === "video") {
        setActiveMediaId("video_0");
      }
    },
    [activeMediaId, destination.panoramicViews, setViewMode],
  );

  // Zoom controls for 360 viewer
  const handleZoom = useCallback((inOut: "in" | "out") => {
    if (psvRef.current) {
      try {
        const currentZoom = psvRef.current.getZoomLevel();
        const delta = inOut === "in" ? 12 : -12;
        psvRef.current.zoom(currentZoom + delta);
      } catch (err) {
        console.error("Zoom failed:", err);
      }
    }
  }, []);

  // Fullscreen handler
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  }, []);

  return (
    <div className="vt-viewer-container">
      {/* 1. Top-Centered Trail Stop Location Badge */}
      <LocationBadge
        name={destination.name}
        altitude={destination.altitude}
      />

      {/* 2. Main Media Presentation Stage */}
      <div className="vt-display-area">
        {viewMode === "image" && (
          <PhotoStage
            src={currentImageSrc}
            alt={destination.name}
          />
        )}

        {viewMode === "360_uploaded" && currentUploaded360?.imageSrc && (
          <Spherical360Viewer
            ref={psvRef}
            src={currentUploaded360.imageSrc}
            defaultYaw={currentUploaded360.initialViewDirection?.yaw || 0}
            defaultPitch={currentUploaded360.initialViewDirection?.pitch || 0}
          />
        )}

        {viewMode === "360_google" && currentGoogle360?.googleMapsSrc && (
          <GoogleStreetViewEmbed
            src={currentGoogle360.googleMapsSrc}
            title={currentGoogle360.title || `360 View - ${destination.name}`}
          />
        )}

        {viewMode === "video" && currentVideo?.src && (
          <VideoStage
            src={currentVideo.src}
            title={currentVideo.title || `${destination.name} Video`}
            poster={destination.featuredImage}
          />
        )}
      </div>

      {/* 3. Media Thumbnails Strip */}
      <MediaThumbnailStrip
        destination={destination}
        viewMode={viewMode}
        activeMediaId={activeMediaId}
        onSelectMedia={handleSelectMedia}
      />

      {/* 4. Controls Toolbar */}
      <ViewerControlsBar
        viewMode={viewMode}
        onSetViewMode={handleSetViewMode}
        onPrevStop={onPrev}
        onNextStop={onNext}
        hasPrevStop={hasPrev}
        hasNextStop={hasNext}
        hasUploaded360={hasUploaded360}
        hasGoogle360={hasGoogle360}
        hasVideo={hasVideo}
        onZoom={handleZoom}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </div>
  );
};

export default MainViewer;
