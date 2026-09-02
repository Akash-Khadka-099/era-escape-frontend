import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { LeftOutlined, RightOutlined, FullscreenOutlined, FullscreenExitOutlined, ZoomInOutlined, ZoomOutOutlined, VideoCameraOutlined, PictureOutlined, GlobalOutlined } from '@ant-design/icons';
import { Destination, ViewMode } from '@/Pages/VirtualTour/types';
import { EnvironmentOutlined } from '@ant-design/icons';

interface MainViewerProps {
  destination: Destination;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const MainViewer: React.FC<MainViewerProps> = ({ destination, viewMode, setViewMode, onNext, onPrev, hasNext, hasPrev }) => {
  const psvContainerRef = useRef<HTMLDivElement>(null);
  const psvInstanceRef = useRef<Viewer | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMediaId, setActiveMediaId] = useState<string>('featured');

  // Determine current active media based on viewMode and activeMediaId
  let currentMediaSrc = destination.featuredImage;
  let activeGoogle360 = '';
  let activeUploaded360 = null;
  
  if (viewMode === 'image') {
    if (activeMediaId.startsWith('gallery_')) {
      const idx = parseInt(activeMediaId.split('_')[1], 10);
      currentMediaSrc = destination.gallery[idx]?.src || destination.featuredImage;
    }
  } else if (viewMode === '360_google') {
    let rawSrc = '';
    if (activeMediaId.startsWith('pano_')) {
      const idx = parseInt(activeMediaId.split('_')[1], 10);
      rawSrc = destination.panoramicViews[idx]?.googleMapsSrc || '';
    } else {
      const firstGoogle = destination.panoramicViews.find(v => v.type === 'google_embed');
      rawSrc = firstGoogle?.googleMapsSrc || '';
    }
    activeGoogle360 = rawSrc.startsWith('//') ? `https:${rawSrc}` : rawSrc;
  } else if (viewMode === '360_uploaded') {
    if (activeMediaId.startsWith('pano_')) {
      const idx = parseInt(activeMediaId.split('_')[1], 10);
      activeUploaded360 = destination.panoramicViews[idx] || null;
    } else {
      activeUploaded360 = destination.panoramicViews.find(v => v.type === 'uploaded_360') || null;
    }
  }

  // Reset active media when destination changes
  useEffect(() => {
    setActiveMediaId('featured');
  }, [destination]);

  useEffect(() => {
    if (viewMode === '360_uploaded' && psvContainerRef.current && activeUploaded360 && activeUploaded360.imageSrc) {
      if (psvInstanceRef.current) {
        psvInstanceRef.current.destroy();
      }
      
      psvInstanceRef.current = new Viewer({
        container: psvContainerRef.current,
        panorama: activeUploaded360.imageSrc,
        defaultYaw: activeUploaded360.initialViewDirection?.yaw || 0,
        defaultPitch: activeUploaded360.initialViewDirection?.pitch || 0,
        navbar: false, // We'll use our own controls
      });
    } else {
      if (psvInstanceRef.current) {
        psvInstanceRef.current.destroy();
        psvInstanceRef.current = null;
      }
    }

    return () => {
      if (psvInstanceRef.current) {
        psvInstanceRef.current.destroy();
        psvInstanceRef.current = null;
      }
    };
  }, [viewMode, activeUploaded360]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleZoom = (inOut: 'in' | 'out') => {
    if (viewMode === '360_uploaded' && psvInstanceRef.current) {
      const currentZoom = psvInstanceRef.current.getZoomLevel();
      psvInstanceRef.current.zoom(currentZoom + (inOut === 'in' ? 10 : -10));
    }
  };

  const hasGoogle360 = destination.panoramicViews.some(v => v.type === 'google_embed');
  const hasUploaded360 = destination.panoramicViews.some(v => v.type === 'uploaded_360');
  const hasGallery = destination.gallery && destination.gallery.length > 0;

  return (
    <div className="vt-viewer-container">
      <div className="vt-location-badge">
        <EnvironmentOutlined /> {destination.name}
      </div>

      {/* Main Display Area */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        {viewMode === 'image' && (
          <img 
            src={currentMediaSrc} 
            alt={destination.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'fadeUpAnimation 0.5s' }} 
          />
        )}
        
        {viewMode === '360_google' && activeGoogle360 && (
          <iframe
            key={activeGoogle360}
            src={activeGoogle360}
            className="google-map-iframe"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}

        {viewMode === '360_uploaded' && (
          <div ref={psvContainerRef} className="psv-container" />
        )}
      </div>

      {/* Media Thumbnails Strip */}
      <div className="vt-media-strip">
        <div 
          className={`vt-media-thumb ${viewMode === 'image' && activeMediaId === 'featured' ? 'active' : ''}`} 
          onClick={() => { setViewMode('image'); setActiveMediaId('featured'); }}
        >
          <img src={destination.featuredImage} alt="Featured" />
          <span className="category-label">Featured</span>
        </div>
        
        {destination.panoramicViews.map((pano, idx) => {
          const panoViewMode: ViewMode = pano.type === 'google_embed' ? '360_google' : '360_uploaded';
          return (
            <div 
              key={`pano-${idx}`} 
              className={`vt-media-thumb ${viewMode === panoViewMode && activeMediaId === `pano_${idx}` ? 'active' : ''}`} 
              onClick={() => { setViewMode(panoViewMode); setActiveMediaId(`pano_${idx}`); }}
            >
              <img src={pano.thumbnail} alt={pano.title} />
              <span className="category-label"><GlobalOutlined /> {pano.title || '360° View'}</span>
            </div>
          );
        })}

        {destination.gallery.map((item, idx) => (
          <div 
            key={`gallery-${idx}`} 
            className={`vt-media-thumb ${viewMode === 'image' && activeMediaId === `gallery_${idx}` ? 'active' : ''}`} 
            onClick={() => { setViewMode('image'); setActiveMediaId(`gallery_${idx}`); }}
          >
            <img src={item.thumbnail} alt={item.caption} />
            <span className="category-label">{item.category}</span>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="vt-controls-bar">
        <button className="vt-control-btn" onClick={onPrev} disabled={!hasPrev} title="Previous Stop">
          <LeftOutlined />
        </button>

        {viewMode !== '360_google' && (
          <>
            <button className="vt-control-btn" onClick={() => handleZoom('in')} title="Zoom In">
              <ZoomInOutlined />
            </button>
            <button className="vt-control-btn" onClick={() => handleZoom('out')} title="Zoom Out">
              <ZoomOutOutlined />
            </button>
          </>
        )}
        
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />

        <button className={`vt-control-btn ${viewMode === 'image' ? 'active' : ''}`} onClick={() => { setViewMode('image'); setActiveMediaId('featured'); }} title="Photo View">
          <PictureOutlined />
        </button>

        {hasGoogle360 && (
          <button 
            className={`vt-control-btn ${viewMode === '360_google' ? 'active' : ''}`} 
            onClick={() => { 
              setViewMode('360_google'); 
              const panoIdx = parseInt(activeMediaId.split('_')[1] || '0', 10);
              const isCurrentlyGooglePano = activeMediaId.startsWith('pano_') && destination.panoramicViews[panoIdx]?.type === 'google_embed';
              if (!isCurrentlyGooglePano) {
                setActiveMediaId(`pano_${destination.panoramicViews.findIndex(v => v.type === 'google_embed')}`);
              }
            }} 
            title="360° Google View"
          >
            <GlobalOutlined />
          </button>
        )}

        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />

        <button className="vt-control-btn" onClick={toggleFullscreen} title="Fullscreen">
          {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </button>

        <button className="vt-control-btn" onClick={onNext} disabled={!hasNext} title="Next Stop">
          <RightOutlined />
        </button>
      </div>
    </div>
  );
};

export default MainViewer;
