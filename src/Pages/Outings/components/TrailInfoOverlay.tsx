/**
 * TrailInfoOverlay.tsx
 * Floating panel on the map that shows:
 *  - Start location name
 *  - Destination name
 *  - Actual routed distance (km)
 *  - Estimated travel time
 *  - Clear trail button
 */

import React from "react";
import { FaRoute, FaClock, FaMapMarkerAlt, FaTimes, FaFlag } from "react-icons/fa";
import styles from "../OutingsDiscovery.module.scss";

interface TrailInfoOverlayProps {
  startPlaceName: string;
  destinationName: string;
  distanceKm: number;
  durationLabel: string;
  onClear: () => void;
}

const TrailInfoOverlay: React.FC<TrailInfoOverlayProps> = ({
  startPlaceName,
  destinationName,
  distanceKm,
  durationLabel,
  onClear,
}) => {
  return (
    <div className={styles.trailInfoOverlay}>
      {/* Header */}
      <div className={styles.trailInfoHeader}>
        <div className={styles.trailInfoTitle}>
          <FaRoute className={styles.trailInfoTitleIcon} />
          <span>Trail Route</span>
        </div>
        <button
          className={styles.trailInfoCloseBtn}
          onClick={onClear}
          aria-label="Clear trail"
          title="Clear trail"
        >
          <FaTimes />
        </button>
      </div>

      {/* Route path */}
      <div className={styles.trailRoute}>
        <div className={styles.trailRoutePoint}>
          <div className={styles.trailRouteIconStart}>
            <FaMapMarkerAlt />
          </div>
          <span className={styles.trailRouteLabel}>{startPlaceName}</span>
        </div>
        <div className={styles.trailRouteLine} />
        <div className={styles.trailRoutePoint}>
          <div className={styles.trailRouteIconEnd}>
            <FaFlag />
          </div>
          <span className={styles.trailRouteLabel}>{destinationName}</span>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.trailStats}>
        <div className={styles.trailStatItem}>
          <FaRoute className={styles.trailStatIcon} />
          <div>
            <div className={styles.trailStatValue}>{distanceKm} km</div>
            <div className={styles.trailStatLabel}>Distance</div>
          </div>
        </div>
        <div className={styles.trailStatDivider} />
        <div className={styles.trailStatItem}>
          <FaClock className={styles.trailStatIcon} />
          <div>
            <div className={styles.trailStatValue}>{durationLabel}</div>
            <div className={styles.trailStatLabel}>Est. Drive</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TrailInfoOverlay);
