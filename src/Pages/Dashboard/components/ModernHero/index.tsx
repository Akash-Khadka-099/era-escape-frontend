import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, ArrowRightOutlined } from "@ant-design/icons";
import {
  FaMountain,
  FaCalendarAlt,
  FaSun,
  FaMapMarkerAlt,
  FaHiking,
} from "react-icons/fa";

import "./ModernHero.css";

import { useDebounce } from "@/components/hooks/useDebounce";
import {
  useFetchGlobalTravelSearch,
  useFetchFeaturedHomepageAdventures,
  type FeaturedAdventureItem,
} from "@/services/userHomepageServices/homepageServices";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE_API_URL = import.meta.env.VITE_API_URL ?? "";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1400&auto=format&fit=crop";

const resolveUrl = (path?: string | null): string => {
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_API_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

/** Hard → #ef4444, Challenging → #f97316, Moderate/Medium → #f59e0b, Easy → #22c55e */
const difficultyColor = (difficulty?: string | null): string => {
  switch (difficulty?.toLowerCase()) {
    case "hard":        return "#ef4444";
    case "challenging": return "#f97316";
    case "moderate":
    case "medium":     return "#f59e0b";
    case "easy":       return "#22c55e";
    default:           return "#2d5a5a";
  }
};

/** Trek: "14–15 Days" | Hike: null (show trail type instead) */
const formatDuration = (item: FeaturedAdventureItem): string | null => {
  if (!item.isTrek || !item.averageDurationDays) return null;
  return `${item.averageDurationDays}–${item.averageDurationDays + 1} Days`;
};

const formatAltitude = (meters?: number | null): string =>
  meters ? `${meters.toLocaleString()}m` : "—";

const formatRegion = (regions?: FeaturedAdventureItem["region"]): string =>
  regions?.length ? regions.map((r) => r?.name).filter(Boolean).join(", ") : "—";

const formatSeasons = (seasons?: string[]): string =>
  seasons?.length ? seasons.slice(0, 2).join(" & ") : "—";

const exploreLabel = (item: FeaturedAdventureItem): string =>
  item.isTrek ? "Explore Trek" : "Explore Hike";

// ─── Component ────────────────────────────────────────────────────────────────

const ModernHero: React.FC = () => {
  const [searchQuery, setSearchQuery]         = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeIndex, setActiveIndex]         = useState(0);

  const { data: adventuresResponse, isLoading: adventuresLoading } =
    useFetchFeaturedHomepageAdventures();
  const adventures = adventuresResponse?.data ?? [];

  // Auto-advance carousel – resets whenever the list length changes
  useEffect(() => {
    if (!adventures.length) return;
    const id = window.setInterval(() => {
      setActiveIndex((idx) =>
        idx === adventures.length - 1 ? 0 : idx + 1
      );
    }, 8000);
    return () => window.clearInterval(id);
  }, [adventures.length]);

  // Clamp active index if the API returns fewer items than expected
  const safeIndex = adventures.length
    ? Math.min(activeIndex, adventures.length - 1)
    : 0;
  const active = adventures[safeIndex];

  // ─── Search ──────────────────────────────────────────────────────────────
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: searchResults, isFetching } = useFetchGlobalTravelSearch(
    { q: debouncedSearchQuery },
    { enabled: debouncedSearchQuery.trim().length > 0 }
  );

  const navigate = useNavigate();
  const results  = searchResults?.data ?? [];

  const handleResultClick = (item: any) => {
    const base =
      item?.contentType === "hike" ? "/explore-hikes" : "/trek-trails";
    navigate(`${base}/detail/${item?.slug}`);
  };

  const handleExploreCta = () => {
    if (!active) return;
    const base = active.isTrek ? "/trek-trails" : "/explore-hikes";
    navigate(`${base}/detail/${active.slug}`);
  };

  // ─── Per-slide background (video → image fallback) ───────────────────────
  const renderBackground = (item: FeaturedAdventureItem, index: number) => {
    const cls = `extremo-hero__video${index === safeIndex ? " active" : ""}`;

    if (item.featuredVideo?.path) {
      return (
        <video
          key={item._id}
          autoPlay
          loop
          muted
          playsInline
          className={cls}
          src={resolveUrl(item.featuredVideo.path)}
        />
      );
    }

    return (
      <div
        key={item._id}
        className={cls}
        style={{
          backgroundImage: `url(${resolveUrl(item.featuredImage?.path)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  };

  // ─── Loading shimmer ──────────────────────────────────────────────────────
  if (adventuresLoading) {
    return (
      <section className="extremo-hero-section">
        <div className="extremo-hero-frame extremo-hero-frame--loading" />
      </section>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────────────
  return (
    <section className="extremo-hero-section">
      <div className="extremo-hero-frame">

        {/* Slide backgrounds */}
        {adventures.map((item, index) => renderBackground(item, index))}

        <div className="extremo-hero__content-new">
          {/* ── Left: slogan + search ──────────────────────────────────── */}
          <div className="extremo-hero__left-content">
            <h1 className="extremo-hero__title-new">
              {active?.shortDescription
                ? active.shortDescription
                    .split(/[.,!]/)
                    .slice(0, 2)
                    .map((line, i) => (
                      <span key={i}>
                        {line.trim()}
                        <br />
                      </span>
                    ))
                : "\u00a0"}
            </h1>

            {/* Search bar */}
            <div
              className={`extremo-hero__search-container-new ${
                isSearchFocused ? "focused" : ""
              }`}
            >
              <div className="extremo-search-box">
                <SearchOutlined className="extremo-search-icon" />
                <input
                  type="text"
                  placeholder="Find your treks, hikes, destinations..."
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
                    {results.map((item, idx) => (
                      <div
                        key={idx}
                        className="extremo-search-item"
                        onClick={() => handleResultClick(item)}
                      >
                        <img
                          src={resolveUrl(item?.featuredImage?.path)}
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
                            {item?.shortSlogan ??
                              item?.summary ??
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

          {/* ── Right: info card (desktop only) ────────────────────── */}
          {active && (
            <div className="extremo-hero__info-card-wrapper">
              <div className="extremo-hero__info-card">

                {/* Header: thumb + title + difficulty badge + region */}
                <div className="extremo-hero__card-header">
                  <img
                    className="extremo-hero__card-thumb"
                    src={resolveUrl(active.featuredImage?.path)}
                    alt={active.title}
                  />
                  <div className="extremo-hero__card-header-info">
                    <span
                      className="extremo-hero__card-difficulty"
                      style={{ background: difficultyColor(active.difficulty) }}
                    >
                      {active.difficulty ?? "—"}
                    </span>
                    <h3 className="extremo-hero__card-title">{active.title}</h3>
                    <p className="extremo-hero__card-region">
                      <FaMapMarkerAlt
                        style={{ marginRight: 4, color: "#2d5a5a" }}
                      />
                      {formatRegion(active.region)}
                    </p>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="extremo-hero__card-stats">

                  {/* Altitude — always shown */}
                  <div className="extremo-hero__card-stat">
                    <FaMountain className="extremo-hero__card-stat-icon" />
                    <span className="extremo-hero__card-stat-value">
                      {formatAltitude(active.maxAltitudeMeter)}
                    </span>
                    <span className="extremo-hero__card-stat-label">
                      Altitude
                    </span>
                  </div>

                  <div className="extremo-hero__card-stat-divider" />

                  {/* Trek → Duration | Hike → Trail Type */}
                  <div className="extremo-hero__card-stat">
                    {active.isTrek ? (
                      <>
                        <FaCalendarAlt className="extremo-hero__card-stat-icon" />
                        <span className="extremo-hero__card-stat-value">
                          {formatDuration(active) ?? "—"}
                        </span>
                        <span className="extremo-hero__card-stat-label">
                          Duration
                        </span>
                      </>
                    ) : (
                      <>
                        <FaHiking className="extremo-hero__card-stat-icon" />
                        <span className="extremo-hero__card-stat-value">
                          Day Hike
                        </span>
                        <span className="extremo-hero__card-stat-label">
                          Trail Type
                        </span>
                      </>
                    )}
                  </div>

                  <div className="extremo-hero__card-stat-divider" />

                  {/* Best season */}
                  <div className="extremo-hero__card-stat">
                    <FaSun className="extremo-hero__card-stat-icon" />
                    <span className="extremo-hero__card-stat-value">
                      {formatSeasons(active.recommendedSeasons)}
                    </span>
                    <span className="extremo-hero__card-stat-label">
                      Best Season
                    </span>
                  </div>
                </div>

                {/* CTA button */}
                <button
                  className="extremo-hero__card-cta"
                  onClick={handleExploreCta}
                >
                  {exploreLabel(active)} <ArrowRightOutlined />
                </button>

              </div>
            </div>
          )}

          {/* ── Mobile mini-pill card (≤ 900px only) ────────────────── */}
          {active && (
            <div className="extremo-hero__mobile-pill" onClick={handleExploreCta}>
              <img
                className="extremo-hero__mobile-pill-img"
                src={resolveUrl(active.featuredImage?.path)}
                alt={active.title}
              />
              <div className="extremo-hero__mobile-pill-body">
                <span
                  className="extremo-hero__mobile-pill-badge"
                  style={{ background: difficultyColor(active.difficulty) }}
                >
                  {active.difficulty ?? "—"}
                </span>
                <h4 className="extremo-hero__mobile-pill-title">{active.title}</h4>
                <p className="extremo-hero__mobile-pill-desc">
                  {active.shortDescription?.slice(0, 72)}
                  {(active.shortDescription?.length ?? 0) > 72 ? "…" : ""}
                </p>
              </div>
              <button
                className="extremo-hero__mobile-pill-cta"
                onClick={(e) => { e.stopPropagation(); handleExploreCta(); }}
              >
                <ArrowRightOutlined />
              </button>
            </div>
          )}
        </div>

        {/* Carousel dots */}
        <div className="extremo-hero__dots">
          {adventures.map((_, index) => (
            <div
              key={index}
              className={`extremo-hero__dot ${
                safeIndex === index ? "active" : ""
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
