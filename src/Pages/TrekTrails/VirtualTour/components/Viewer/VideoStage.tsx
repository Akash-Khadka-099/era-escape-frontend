import React from "react";

interface VideoStageProps {
  src: string;
  title: string;
  poster?: string;
}

/**
 * Stage component to play videos (local/server MP4/WebM or embedded YouTube streams).
 */
const VideoStage: React.FC<VideoStageProps> = ({ src, title, poster }) => {
  // Check if src is a YouTube URL
  const isYouTube =
    src.includes("youtube.com") || src.includes("youtu.be");

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split("&")[0] || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    }
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
      : url;
  };

  if (isYouTube) {
    return (
      <div className="vt-video-stage">
        <iframe
          src={getYouTubeEmbedUrl(src)}
          title={title}
          className="vt-main-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="vt-video-stage">
      <video
        key={src}
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        className="vt-main-video"
      >
        Your browser does not support HTML5 video playback.
      </video>
    </div>
  );
};

export default React.memo(VideoStage);
