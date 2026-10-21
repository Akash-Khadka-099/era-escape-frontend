import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { ConfigProvider, theme, Spin } from "antd";
import TourHeader from "@/Pages/TrekTrails/VirtualTour/components/TourHeader";
import TourSidebar from "@/Pages/TrekTrails/VirtualTour/components/TourSidebar";
import MainViewer from "@/Pages/TrekTrails/VirtualTour/components/MainViewer";
import InfoPanel from "@/Pages/TrekTrails/VirtualTour/components/InfoPanel";
import { buildVirtualTourData } from "@/Pages/TrekTrails/VirtualTour/utils/tourDataAdapter";
import { ViewMode } from "@/Pages/TrekTrails/VirtualTour/types";
import { useFetchVirtualTourBySlug } from "@/services/trekServices/trekServices";
import "@/Pages/TrekTrails/VirtualTour/VirtualTour.css";

export interface VirtualTourProps {
  open: boolean;
  onClose: () => void;
  trekDetail?: any;
  slug?: string;
}

/**
 * Top-Level Virtual Tour Modal Orchestrator:
 * Mounts directly to document.body via Portal for an immersive, distraction-free presentation experience.
 * Fetches real 360 data via useFetchVirtualTourBySlug and streams into modular viewer components.
 */
const VirtualTour: React.FC<VirtualTourProps> = ({
  open,
  onClose,
  trekDetail,
  slug,
}) => {
  const tourSlug = slug || trekDetail?.slug || "";

  // 1. Fetch real virtual tour data from backend API
  const { data: apiVirtualTourResponse, isLoading } = useFetchVirtualTourBySlug(
    open && tourSlug ? tourSlug : "",
  );

  // 2. Normalize and adapt API payload with fallback support
  const tourData = useMemo(
    () => buildVirtualTourData(apiVirtualTourResponse, trekDetail),
    [apiVirtualTourResponse, trekDetail],
  );

  const { trek } = tourData;

  const [activeDestinationIndex, setActiveDestinationIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("image");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [infoPanelOpen, setInfoPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHintBanner, setShowHintBanner] = useState(true);

  const totalStops = trek.destinations.length;
  const activeDestination =
    trek.destinations[activeDestinationIndex] || trek.destinations[0];

  const handleNext = useCallback(() => {
    setActiveDestinationIndex((prev) => (prev < totalStops - 1 ? prev + 1 : prev));
  }, [totalStops]);

  const handlePrev = useCallback(() => {
    setActiveDestinationIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleSelectDestination = (index: number) => {
    setActiveDestinationIndex(index);
  };

  // Reset active stop and show hint when tour opens or data loads
  useEffect(() => {
    if (open) {
      setActiveDestinationIndex(0);
      setViewMode("image");
      setShowHintBanner(true);
      const timer = setTimeout(() => {
        setShowHintBanner(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [open, tourSlug]);

  // Lock body scroll while full page presentation is open
  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [open]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          setIsFullscreen(true);
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
            setIsFullscreen(false);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, handleNext, handlePrev]);

  // Synchronize fullscreen state with browser events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, []);

  if (!open) return null;

  // Mount directly to document.body via Portal so it covers 100% of the entire viewport
  return createPortal(
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#38bdf8",
          colorBgContainer: "#090e1a",
          colorBgLayout: "#020617",
        },
      }}
    >
      <div
        className="vt-presentation-container"
        role="dialog"
        aria-modal="true"
        aria-label="360 Virtual Tour Presentation View"
      >
        {/* Loading Overlay */}
        {isLoading && (!trek.destinations || trek.destinations.length === 0) ? (
          <div className="vt-loading-screen">
            <Spin size="large" />
            <p style={{ marginTop: 16, color: "#38bdf8", fontSize: 15, fontWeight: 600 }}>
              Loading 360° Virtual Tour Experience...
            </p>
            <span style={{ color: "#94a3b8", fontSize: 12 }}>
              Connecting trail scenes, panoramas & high-altitude media
            </span>
          </div>
        ) : activeDestination ? (
          <>
            {/* Top Floating Presentation Header */}
            <TourHeader
              trekName={trek.name}
              region={trek.region}
              destinationName={activeDestination.name}
              altitude={activeDestination.altitude}
              currentIndex={activeDestinationIndex}
              totalStops={totalStops}
              onClose={onClose}
              onNext={handleNext}
              onPrev={handlePrev}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
              infoPanelOpen={infoPanelOpen}
              onToggleInfoPanel={() => setInfoPanelOpen((prev) => !prev)}
            />

            {/* Transient Presentation Hint Banner */}
            {showHintBanner && (
              <div className="vt-presentation-banner">
                <span>
                  Presentation View: Use <kbd className="vt-esc-kbd">←</kbd> <kbd className="vt-esc-kbd">→</kbd> to switch stops • Press <kbd className="vt-esc-kbd">ESC</kbd> or click Exit
                </span>
              </div>
            )}

            {/* Main 3-Column Presentation Canvas */}
            <div className="vt-layout-body">
              {/* Left: Route Stops list */}
              <aside className={`vt-sidebar ${sidebarOpen ? "" : "collapsed"}`} aria-label="Route stops list">
                <TourSidebar
                  trek={trek}
                  activeIndex={activeDestinationIndex}
                  onSelectDestination={handleSelectDestination}
                />
              </aside>

              {/* Center: Main 360 / Photo / Video presentation stage */}
              <main className="vt-main-content">
                <MainViewer
                  destination={activeDestination}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  hasNext={activeDestinationIndex < totalStops - 1}
                  hasPrev={activeDestinationIndex > 0}
                />
              </main>

              {/* Right: Destination Details, Elevation Trend & Lodges */}
              <aside className={`vt-info-panel ${infoPanelOpen ? "" : "collapsed"}`} aria-label="Destination details">
                <InfoPanel
                  destination={activeDestination}
                  destinations={trek.destinations}
                  activeStopIndex={activeDestinationIndex}
                />
              </aside>
            </div>
          </>
        ) : (
          <div className="vt-loading-screen">
            <p style={{ color: "#94a3b8", fontSize: 14 }}>
              No virtual tour destinations available for this trek.
            </p>
          </div>
        )}
      </div>
    </ConfigProvider>,
    document.body,
  );
};

export default VirtualTour;
