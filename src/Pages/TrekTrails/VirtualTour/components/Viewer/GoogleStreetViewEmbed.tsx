import React from "react";

interface GoogleStreetViewEmbedProps {
  src: string;
  title: string;
}

/**
 * Embeds official Google Maps Street View 360 interactive panoramas via iframe.
 */
const GoogleStreetViewEmbed: React.FC<GoogleStreetViewEmbedProps> = ({
  src,
  title,
}) => {
  const normalizedSrc = src.startsWith("//") ? `https:${src}` : src;

  return (
    <div className="vt-google-stage">
      <iframe
        key={normalizedSrc}
        src={normalizedSrc}
        className="google-map-iframe"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
    </div>
  );
};

export default React.memo(GoogleStreetViewEmbed);
