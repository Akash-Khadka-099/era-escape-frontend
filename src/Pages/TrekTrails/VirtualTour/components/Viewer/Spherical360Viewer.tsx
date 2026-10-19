import React, { forwardRef, useMemo, useRef, useCallback } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { AutorotatePlugin } from "@photo-sphere-viewer/autorotate-plugin";
import "@photo-sphere-viewer/core/index.css";

interface Spherical360ViewerProps {
  src: string;
  defaultYaw?: number;
  defaultPitch?: number;
  onReady?: (instance: any) => void;
}

/**
 * 360° Spherical Equirectangular Panorama Viewer using react-photo-sphere-viewer.
 *
 * Automatically begins gentle cinematic rotation on initial load so users
 * immediately recognize and experience the interactive spherical space.
 * Once the user manually interacts (drags, moves, touches, or scrolls),
 * auto-rotation stops immediately and hands full manual control to the user.
 */
const Spherical360Viewer = forwardRef<any, Spherical360ViewerProps>(
  ({ src, defaultYaw = 0, defaultPitch = 0, onReady }, ref) => {
    const viewerInstanceRef = useRef<any>(null);

    // Stop auto-rotation immediately when the user manually interacts
    const stopAutoRotate = useCallback(() => {
      if (viewerInstanceRef.current) {
        try {
          const autorotate = viewerInstanceRef.current.getPlugin?.(AutorotatePlugin);
          if (autorotate && typeof autorotate.stop === "function") {
            autorotate.stop();
          }
          if (typeof viewerInstanceRef.current.stopAll === "function") {
            viewerInstanceRef.current.stopAll();
          }
        } catch {
          // Ignore if already stopped or disposed
        }
      }
    }, []);

    // Configure Autorotate plugin:
    // - autostartDelay: 500ms delay after load before starting gentle rotation
    // - autostartOnIdle: false -> once stopped by user interaction, it remains manual
    // - autorotateSpeed: "1.2rpm" -> gentle, natural scenic preview speed
    const plugins = useMemo(() => {
      return [
        [
          AutorotatePlugin,
          {
            autostartDelay: 500,
            autostartOnIdle: false,
            autorotateSpeed: "1.2rpm",
            autorotatePitch: defaultPitch,
          },
        ],
      ] as any;
    }, [defaultPitch]);

    const handleReady = useCallback(
      (instance: any) => {
        viewerInstanceRef.current = instance;
        if (typeof ref === "function") {
          ref(instance);
        } else if (ref && "current" in ref) {
          (ref as any).current = instance;
        }

        if (onReady) {
          onReady(instance);
        }
      },
      [onReady, ref],
    );

    return (
      <div
        className="vt-psv-wrapper"
        onPointerDown={stopAutoRotate}
        onTouchStart={stopAutoRotate}
        onWheel={stopAutoRotate}
      >
        <ReactPhotoSphereViewer
          key={src}
          src={src}
          height="100%"
          width="100%"
          containerClass="psv-container"
          navbar={false}
          defaultYaw={defaultYaw}
          defaultPitch={defaultPitch}
          plugins={plugins}
          onReady={handleReady}
          mousewheel={true}
          mousemove={true}
        />
      </div>
    );
  },
);

Spherical360Viewer.displayName = "Spherical360Viewer";

export default React.memo(Spherical360Viewer);

