import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, ArrowRightOutlined } from "@ant-design/icons";
import {
  FaMountain,
  FaCalendarAlt,
  FaSun,
  FaMapMarkerAlt,
} from "react-icons/fa";

import HeroImage from "@/assets/images/hero.png";
import StoryImage from "@/assets/images/story.png";
import TrekImage from "@/assets/images/trek1.png";

import "./ModernHero.css";

import { useDebounce } from "@/components/hooks/useDebounce";
import { useFetchGlobalTravelSearch } from "@/services/userHomepageServices/homepageServices";
import { message } from "antd";

const heroData = [
  {
    id: 1,
    title: "Langtang",
    slogan: "Where the Cold\nHorizons Begin",
    videoSrc: "/videos/10264379-uhd_3840_2160_30fps.mp4",
    altitude: "3,870m",
    duration: "7–10 Days",
    difficulty: "Moderate",
    difficultyColor: "#f59e0b",
    season: "Oct – Nov",
    region: "Langtang, Bagmati",
    tags: ["Routes", "Guides", "Regions"],
    image: TrekImage,
  },
  {
    id: 2,
    title: "Everest Base Camp",
    slogan: "Footsteps to\nthe Top of the World",
    videoSrc: "/videos/13191880_2560_1440_30fps.mp4",
    altitude: "5,364m",
    duration: "14–16 Days",
    difficulty: "Hard",
    difficultyColor: "#ef4444",
    season: "Mar – May",
    region: "Khumbu, Solukhumbu",
    tags: ["Routes", "Guides", "Regions"],
    image: StoryImage,
  },
  {
    id: 3,
    title: "Tsho Rolpa",
    slogan: "Serenity at\nthe Highest Peaks",
    videoSrc: "/videos/20158879-uhd_3840_2160_60fps.mp4",
    altitude: "4,580m",
    duration: "10–12 Days",
    difficulty: "Challenging",
    difficultyColor: "#f97316",
    season: "Apr – Jun",
    region: "Rolwaling, Dolakha",
    tags: ["Routes", "Guides", "Regions"],
    image: HeroImage,
  },
];

const ModernHero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto change carousel
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === heroData.length - 1 ? 0 : currentIndex + 1,
      );
    }, 8000); // 8 seconds per video

    return () => window.clearInterval(intervalId);
  }, []);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: searchResults, isFetching } = useFetchGlobalTravelSearch(
    { q: debouncedSearchQuery },
    { enabled: debouncedSearchQuery.trim().length > 0 },
  );

  const navigate = useNavigate();
  const results = searchResults?.data || [];

  const handleResultClick = (item: any) => {
    const basePath =
      item?.contentType === "hike" ? "/explore-hikes" : "/trek-trails";
    navigate(`${basePath}/detail/${item?.slug}`);
  };

  const resolveImageUrl = (imagePath?: string) => {
    const BASE_API_URL = import.meta.env.VITE_API_URL;
    const FALLBACK_IMAGE =
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1400&auto=format&fit=crop";

    if (!imagePath) return FALLBACK_IMAGE;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
      return imagePath;

    const normalizedPath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;
    return `${BASE_API_URL}${normalizedPath}`;
  };

  const handleSearchClick = () => {
    if (results.length > 0) {
      handleResultClick(results[0]);
    } else if (searchQuery.toLowerCase().includes("everest")) {
      navigate("/trek-trails/detail/everest-base-camp");
    } else {
      navigate("/explore-hikes");
    }
  };

  return (
    <section className="extremo-hero-section">
      <div className="extremo-hero-frame">
        {heroData.map((data, index) => (
          <video
            key={data.id}
            autoPlay
            loop
            muted
            playsInline
            className={`extremo-hero__video ${
              index === activeIndex ? "active" : ""
            }`}
            src={data.videoSrc}
          />
        ))}

        <div className="extremo-hero__content-new">
          <div className="extremo-hero__left-content">
            <h1 className="extremo-hero__title-new">
              {heroData[activeIndex].slogan.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </h1>

            <div
              className={`extremo-hero__search-container-new ${isSearchFocused ? "focused" : ""}`}
            >
              <div className="extremo-search-box">
                <SearchOutlined className="extremo-search-icon" />
                <input
                  type="text"
                  placeholder="Find your destination..."
                  className="extremo-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    setTimeout(() => setIsSearchFocused(false), 200);
                  }}
                />
              </div>

              <div
                className={`extremo-search-dropdown ${
                  isSearchFocused && searchQuery ? "active" : ""
                }`}
              >
                {isFetching ? (
                  <div className="extremo-search-empty">
                    Searching for "{searchQuery}"...
                  </div>
                ) : results.length > 0 ? (
                  <div className="extremo-search-results">
                    {results.map((item, index) => (
                      <div
                        key={index}
                        className="extremo-search-item"
                        onClick={() => handleResultClick(item)}
                      >
                        <img
                          src={resolveImageUrl(item?.featuredImage?.path)}
                          alt={item?.title}
                        />
                        <div className="extremo-search-item-info">
                          <div className="extremo-search-item-header">
                            <h4>{item?.title}</h4>
                            <span className="extremo-search-item-type">
                              {item?.contentType}
                            </span>
                          </div>
                          <p className="extremo-search-item-slogan">
                            {item?.shortSlogan ||
                              item?.summary ||
                              item?.shortNotes}
                          </p>
                        </div>
                        <ArrowRightOutlined className="extremo-search-item-arrow" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="extremo-search-empty">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="extremo-hero__info-card-wrapper">
            <div className="extremo-hero__info-card">
              {/* Header: image + trek name + difficulty badge */}
              <div className="extremo-hero__card-header">
                <img
                  className="extremo-hero__card-thumb"
                  src={heroData[activeIndex].image}
                  alt={heroData[activeIndex].title}
                />
                <div className="extremo-hero__card-header-info">
                  <span
                    className="extremo-hero__card-difficulty"
                    style={{
                      background: heroData[activeIndex].difficultyColor,
                    }}
                  >
                    {heroData[activeIndex].difficulty}
                  </span>
                  <h3 className="extremo-hero__card-title">
                    {heroData[activeIndex].title}
                  </h3>
                  <p className="extremo-hero__card-region">
                    <FaMapMarkerAlt
                      style={{ marginRight: 4, color: "#2d5a5a" }}
                    />
                    {heroData[activeIndex].region}
                  </p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="extremo-hero__card-stats">
                <div className="extremo-hero__card-stat">
                  <FaMountain className="extremo-hero__card-stat-icon" />
                  <span className="extremo-hero__card-stat-value">
                    {heroData[activeIndex].altitude}
                  </span>
                  <span className="extremo-hero__card-stat-label">
                    Altitude
                  </span>
                </div>
                <div className="extremo-hero__card-stat-divider" />
                <div className="extremo-hero__card-stat">
                  <FaCalendarAlt className="extremo-hero__card-stat-icon" />
                  <span className="extremo-hero__card-stat-value">
                    {heroData[activeIndex].duration}
                  </span>
                  <span className="extremo-hero__card-stat-label">
                    Duration
                  </span>
                </div>
                <div className="extremo-hero__card-stat-divider" />
                <div className="extremo-hero__card-stat">
                  <FaSun className="extremo-hero__card-stat-icon" />
                  <span className="extremo-hero__card-stat-value">
                    {heroData[activeIndex].season}
                  </span>
                  <span className="extremo-hero__card-stat-label">
                    Best Season
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button
                className="extremo-hero__card-cta"
                onClick={() => {
                  message.success("Working on it, stay tuned!");
                }}
              >
                Explore Trek <ArrowRightOutlined />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="extremo-hero__dots">
          {heroData.map((_, index) => (
            <div
              key={index}
              className={`extremo-hero__dot ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModernHero;
