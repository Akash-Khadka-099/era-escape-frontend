import React from "react";

interface PhotoStageProps {
  src: string;
  alt: string;
}

/**
 * Renders standard photos with high fidelity object-fit and smooth fade animation.
 */
const PhotoStage: React.FC<PhotoStageProps> = ({ src, alt }) => {
  return (
    <div className="vt-photo-stage">
      <img
        src={src}
        alt={alt}
        className="vt-main-image"
        loading="eager"
      />
    </div>
  );
};

export default React.memo(PhotoStage);
