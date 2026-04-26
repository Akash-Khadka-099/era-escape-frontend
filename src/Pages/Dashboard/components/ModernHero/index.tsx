import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

import HeroImage from "@/assets/images/hero.png";
import StoryImage from "@/assets/images/story.png";
import TrekImage from "@/assets/images/trek1.png";

import "./ModernHero.css";

import { useDebounce } from "@/components/hooks/useDebounce";
import { useFetchGlobalTravelSearch } from "@/services/userHomepageServices/homepageServices";

const ModernHero: React.FC = () => {
  const heroImages = [
    {
      src: HeroImage,
      alt: "Mountain travel landscape",
      title: "Go where ordinary views end.",
      subtitle:
        "Discover trekking routes, mountain lodges, and adventure expeditions tailored to your travel rhythm.",
    },
    {
      src: StoryImage,
      alt: "Mountain adventure scenery",
      title: "Adventure begins with a single bold step.",
      subtitle:
        "Find inspiring journeys, accommodations, and local experiences curated for nature lovers.",
    },
    {
      src: TrekImage,
      alt: "Trekking trail and mountain panorama",
      title: "Mountains, trails, and unforgettable moments.",
      subtitle:
        "Explore exceptional destinations for trekking, active weekends, and high-altitude adventures.",
    },
  ];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Debounce the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch results from API
  const { data: searchResults, isFetching } = useFetchGlobalTravelSearch(
    { q: debouncedSearchQuery },
    { enabled: debouncedSearchQuery.trim().length > 0 },
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImageIndex((currentIndex) =>
        currentIndex === heroImages.length - 1 ? 0 : currentIndex + 1,
      );
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [heroImages.length]);

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

  return (
    <section className="dashboard-modern-hero">
      <div className="dashboard-modern-hero__shell">
        <div
          className="dashboard-modern-hero__background-stage"
          aria-hidden="true"
        >
          {heroImages.map((image, index) => (
            <img
              key={image.alt}
              src={image.src}
              alt={image.alt}
              className={`dashboard-modern-hero__background-image${
                activeImageIndex === index
                  ? " dashboard-modern-hero__background-image--active"
                  : ""
              }`}
            />
          ))}
        </div>
        <div className="dashboard-modern-hero__background-overlay" />

        <div className="dashboard-modern-hero__content">
          <div className="dashboard-modern-hero__search-container">
            <div className="dashboard-modern-hero__search-header">
              <h2 className="dashboard-modern-hero__search-heading">
                Find your perfect escape
              </h2>
              <p className="dashboard-modern-hero__search-subheading">
                Explore hand-picked trails, challenging treks, and serene day
                tours across the Himalayas.
              </p>
            </div>

            <div className="dashboard-modern-hero__search-wrapper">
              <div className="dashboard-modern-hero__search-box">
                <SearchOutlined className="dashboard-modern-hero__search-icon" />
                <input
                  type="text"
                  className="dashboard-modern-hero__search-input"
                  placeholder="Search for destinations, trails, or regions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                />
              </div>

              <div
                className={`dashboard-modern-hero__search-results ${
                  isSearchFocused && searchQuery
                    ? "dashboard-modern-hero__search-results--active"
                    : ""
                }`}
              >
                {isFetching ? (
                  <div className="dashboard-modern-hero__search-empty">
                    Searching for "{searchQuery}"...
                  </div>
                ) : results.length > 0 ? (
                  results.map((item, index) => (
                    <div
                      key={index}
                      className="dashboard-modern-hero__search-item"
                      onClick={() => handleResultClick(item)}
                    >
                      <img
                        src={resolveImageUrl(item?.featuredImage?.path)}
                        alt={item?.title}
                        className="dashboard-modern-hero__search-item-image"
                      />
                      <div className="dashboard-modern-hero__search-item-content">
                        <div className="dashboard-modern-hero__search-item-header">
                          <h4 className="dashboard-modern-hero__search-item-title">
                            {item?.title}
                          </h4>
                          <span className="dashboard-modern-hero__search-item-type">
                            {item?.contentType}
                          </span>
                        </div>
                        <p className="dashboard-modern-hero__search-item-slogan">
                          {item?.shortSlogan ||
                            item?.summary ||
                            item?.shortNotes}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dashboard-modern-hero__search-empty">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-modern-hero__copy">
            <div className="dashboard-modern-hero__copy-stage">
              {heroImages.map((image, index) => (
                <div
                  key={image.alt}
                  className={`dashboard-modern-hero__copy-slide${
                    activeImageIndex === index
                      ? " dashboard-modern-hero__copy-slide--active"
                      : ""
                  }`}
                >
                  <h1 className="dashboard-modern-hero__title">
                    {image.title}
                  </h1>
                  <p className="dashboard-modern-hero__subtitle">
                    {image.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-modern-hero__right-rail">
          <div
            className="dashboard-modern-hero__switcher"
            aria-label="Image switcher"
          >
            {heroImages.map((image, index) => (
              <button
                key={image.alt}
                type="button"
                className={`dashboard-modern-hero__switch-dot${
                  activeImageIndex === index
                    ? " dashboard-modern-hero__switch-dot--active"
                    : ""
                }`}
                onClick={() => setActiveImageIndex(index)}
                aria-label={`Show image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHero;
