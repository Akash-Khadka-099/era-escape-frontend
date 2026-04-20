import React from "react";
import parse from "html-react-parser";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Row,
  Tag,
  Typography,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import {
  FaMountain,
  FaRoute,
  FaRegCalendarAlt,
  FaMapMarkedAlt,
  FaTint,
  FaCampground,
  FaTicketAlt,
  FaBiking,
  FaUmbrellaBeach,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import { SEO } from "@/components/SEO";
import NoDataLottie from "@/components/Feedback/NoDataLottie";
import SuspensePageLoader from "@/components/Loaders/SuspensePageLoader";
import { useGetHikeBlogDetail } from "@/services/hikeServices/hikeServices";
import { HikeBlogDetail } from "@/types/hike";
import "./HikeDetails.css";

const { Title, Text, Paragraph } = Typography;

const BASE_API_URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1600&auto=format&fit=crop";

const buildAssetUrl = (assetPath?: string) => {
  if (!assetPath) {
    return FALLBACK_IMAGE;
  }

  if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
    return assetPath;
  }

  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${BASE_API_URL}${normalizedPath}`;
};

const formatTrailType = (value?: string) => {
  if (!value) {
    return "Not specified";
  }

  return value
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

const formatLatLong = (latLong?: number[]) => {
  if (!latLong || latLong.length < 2) {
    return "Not available";
  }

  return `${latLong[0].toFixed(3)}, ${latLong[1].toFixed(3)}`;
};

const copyTextToClipboard = async (value: string) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);

  if (!copied) {
    throw new Error("Unable to copy link");
  }
};

const buildFeatureCards = (hikeDetail: HikeBlogDetail) => [
  {
    title: "Water Source",
    description: hikeDetail.isWaterSourceAvailable
      ? "Water is available on the route."
      : "Carry enough drinking water for the full hike.",
    icon: <FaTint />,
  },
  {
    title: "Permit",
    description: hikeDetail.isPermitRequired
      ? hikeDetail.permitDetailDescription || "Permit is required for this hike."
      : "No permit requirement was listed.",
    icon: <FaTicketAlt />,
  },
  {
    title: "Picnic",
    description: hikeDetail.isPicnic
      ? hikeDetail.picnicDescription || "Suitable spots are available for a picnic break."
      : "This route is not marked as a picnic hike.",
    icon: <FaUmbrellaBeach />,
  },
  {
    title: "Camping",
    description: hikeDetail.isCampingAllowed
      ? hikeDetail.campingDescription || "Camping is allowed on this route."
      : "Camping is not allowed on this route.",
    icon: <FaCampground />,
  },
  {
    title: "Bike Access",
    description: hikeDetail.isBikeFriendly
      ? hikeDetail.bikeRideDescription || "Bike-friendly sections are available."
      : "This route is not marked as bike-friendly.",
    icon: <FaBiking />,
  },
];

const HikeDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: hikeDetailResponse, isLoading } = useGetHikeBlogDetail(slug || "");

  React.useEffect(() => {
    const preloadMap = () => import("@/Pages/ExploreHikes/HikeTrailMap");
    preloadMap();
  }, []);

  if (isLoading) {
    return <SuspensePageLoader />;
  }

  const hikeDetail = hikeDetailResponse?.data;

  if (!hikeDetail) {
    return <NoDataLottie title="Hike not found." />;
  }

  const regionNames =
    hikeDetail.hikeRegion?.map((region) => region.name).filter(Boolean) || [];
  const categoryTitles =
    hikeDetail.categories?.map((category) => category.title).filter(Boolean) || [];
  const seoTitle =
    hikeDetail.metaTitle ||
    `${hikeDetail.title} Hike | ${hikeDetail.difficulty || "Scenic"} route in ${regionNames[0] || "Nepal"}`;
  const seoDescription =
    hikeDetail.metaDescription ||
    hikeDetail.shortSlogan ||
    "Plan your next hike with route facts, blog sections, and trail highlights.";
  const featureCards = buildFeatureCards(hikeDetail);
  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: window.location.origin,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Explore Hikes",
        item: `${window.location.origin}/explore-hikes`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hikeDetail.title,
        item: window.location.href,
      },
    ],
  };
  const faqSchema =
    hikeDetail.faqs && hikeDetail.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: hikeDetail.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  const handleShare = async () => {
    try {
      await copyTextToClipboard(window.location.href);
      message.success("Link copied to clipboard");
    } catch {
      message.error("Unable to copy the link right now");
    }
  };

  const handleOpenMap = () => {
    if (!slug) {
      return;
    }

    navigate(`/explore-hikes/map/${slug}`);
  };

  const pageStyle: React.CSSProperties = {
    background:
      "radial-gradient(circle at top left, rgba(40, 89, 67, 0.14), transparent 30%), linear-gradient(180deg, #f5f7f1 0%, #f8f8f5 30%, #ffffff 100%)",
    minHeight: "100vh",
    paddingBottom: "96px",
    overflowX: "clip",
  };

  const heroStyle: React.CSSProperties = {
    position: "relative",
    minHeight: "560px",
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
  };

  const heroContentStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    color: "#fff",
    padding: "72px 0 48px",
  };

  const shellStyle: React.CSSProperties = {
    marginTop: "-46px",
    paddingBottom: "46px",
    position: "relative",
    zIndex: 2,
    overflow: "visible",
  };

  const badgeRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  };

  const summaryRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "24px",
  };

  const actionRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "28px",
  };

  const statsGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "26px",
  };

  return (
    <div className="hike-detail-page" style={pageStyle}>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={`${window.location.origin}/explore-hikes/detail/${hikeDetail.slug}`}
        keywords={[
          hikeDetail.title,
          ...regionNames,
          ...categoryTitles,
          ...(hikeDetail.tags || []),
        ]}
        ogImage={buildAssetUrl(hikeDetail.featuredImage?.path)}
        schema={[breadcrumbsSchema, faqSchema].filter(Boolean)}
        openGraphType="article"
      />

      <section className="hike-detail-hero" style={heroStyle}>
        <img
          src={buildAssetUrl(hikeDetail.featuredImage?.path)}
          alt={hikeDetail.title}
          className="hike-detail-hero__image"
        />
        <div className="hike-detail-hero__overlay" />
        <div className="hike-detail-hero__content" style={heroContentStyle}>
          <MiddleContentWrapper extraStyles={{ overflow: "visible" }}>
            <div className="hike-detail-badges" style={badgeRowStyle}>
              {hikeDetail.difficulty ? (
                <span className="hike-detail-badge">{hikeDetail.difficulty}</span>
              ) : null}
              {categoryTitles.map((category) => (
                <span className="hike-detail-badge" key={category}>
                  {category}
                </span>
              ))}
              {regionNames.map((region) => (
                <span className="hike-detail-badge" key={region}>
                  {region}
                </span>
              ))}
            </div>

            <h1 className="hike-detail-title">{hikeDetail.title}</h1>
            <p className="hike-detail-subtitle">
              {hikeDetail.shortSlogan ||
                "A practical overview of the route, trail character, and essential planning details."}
            </p>

            <div className="hike-detail-summary" style={summaryRowStyle}>
              <span className="hike-detail-summary__item">
                <FaMountain />
                {hikeDetail.maxAltitudeMeter
                  ? `${hikeDetail.maxAltitudeMeter} m max altitude`
                  : "Altitude not specified"}
              </span>
              <span className="hike-detail-summary__item">
                <FaRoute />
                {hikeDetail.trailDistanceKm
                  ? `${hikeDetail.trailDistanceKm} km trail`
                  : "Distance not specified"}
              </span>
              <span className="hike-detail-summary__item">
                <FaMapMarkedAlt />
                {formatTrailType(hikeDetail.trailType)}
              </span>
              <span className="hike-detail-summary__item">
                <EnvironmentOutlined />
                {regionNames.join(" • ") || "Nepal"}
              </span>
            </div>

            <div className="hike-detail-actions" style={actionRowStyle}>
              <Button icon={<ShareAltOutlined />} onClick={handleShare}>
                Share Hike
              </Button>
              {hikeDetail.kmlFile?.path ? (
                <Button type="primary" icon={<FaMapMarkedAlt />} onClick={handleOpenMap}>
                  Open Hike Map
                </Button>
              ) : null}
            </div>
          </MiddleContentWrapper>
        </div>
      </section>

      <MiddleContentWrapper
        extraClassNames="hike-detail-shell "
        extraStyles={shellStyle}
      >
        <div className="hike-detail-stats" style={statsGridStyle}>
          <div className="hike-detail-stat">
            <span className="hike-detail-stat__label">Trail Distance</span>
            <div className="hike-detail-stat__value">
              <FaRoute />
              <span>
                {hikeDetail.trailDistanceKm
                  ? `${hikeDetail.trailDistanceKm} km`
                  : "N/A"}
              </span>
            </div>
          </div>
          <div className="hike-detail-stat">
            <span className="hike-detail-stat__label">Max Altitude</span>
            <div className="hike-detail-stat__value">
              <FaMountain />
              <span>
                {hikeDetail.maxAltitudeMeter
                  ? `${hikeDetail.maxAltitudeMeter} m`
                  : "N/A"}
              </span>
            </div>
          </div>
          <div className="hike-detail-stat">
            <span className="hike-detail-stat__label">Best Seasons</span>
            <div className="hike-detail-stat__value">
              <FaRegCalendarAlt />
              <span>
                {hikeDetail.recommendedSeasons?.join(", ") || "All seasons"}
              </span>
            </div>
          </div>
          <div className="hike-detail-stat">
            <span className="hike-detail-stat__label">Route Style</span>
            <div className="hike-detail-stat__value">
              <FaMapMarkedAlt />
              <span>{formatTrailType(hikeDetail.trailType)}</span>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]} align="stretch">
          <Col xs={24} xl={16}>
            <Card className="hike-detail-panel" bordered={false}>
              <Title level={3} className="hike-detail-section-title">
                Overview
              </Title>

              {hikeDetail.blogContent?.length ? (
                hikeDetail.blogContent.map((section, index) => (
                  <div key={`${section.title}-${index}`}>
                    <Title level={4}>{section.title}</Title>

                    {section.images?.length ? (
                      <div className="hike-detail-image-grid">
                        {section.images.map((image) => (
                          <img
                            key={image._id}
                            src={buildAssetUrl(image.path)}
                            alt={`${section.title} visual`}
                            loading="lazy"
                          />
                        ))}
                      </div>
                    ) : null}

                    <div className="hike-html-content">
                      {parse(section.htmlDescription || "")}
                    </div>

                    {index < (hikeDetail.blogContent?.length || 0) - 1 ? (
                      <Divider />
                    ) : null}
                  </div>
                ))
              ) : (
                <Paragraph type="secondary">
                  Detailed hike content has not been added yet.
                </Paragraph>
              )}

              {hikeDetail.highlights?.length ? (
                <>
                  <Divider />
                  <Title level={4}>Trail Highlights</Title>
                  <ul className="hike-detail-highlight-list">
                    {hikeDetail.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </Card>

            <Card
              className="hike-detail-panel"
              bordered={false}
              style={{ marginTop: 24 }}
            >
              <Title level={3} className="hike-detail-section-title">
                Trail Conditions & Planning
              </Title>
              <div className="hike-detail-feature-grid">
                {featureCards.map((feature) => (
                  <div className="hike-detail-feature" key={feature.title}>
                    <Tag
                      bordered={false}
                      color="green"
                      style={{ marginBottom: 10, borderRadius: 999 }}
                    >
                      {feature.icon} {feature.title}
                    </Tag>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {hikeDetail.hikingStops?.length ? (
              <Card
                className="hike-detail-panel"
                bordered={false}
                style={{ marginTop: 24 }}
              >
                <Title level={3} className="hike-detail-section-title">
                  Hiking Stops
                </Title>
                <div className="hike-detail-stop-grid">
                  {hikeDetail.hikingStops.map((stop) => (
                    <div className="hike-detail-stop" key={stop._id}>
                      <h4>{stop.title}</h4>
                      <p>{stop.htmlDescription || "No description available."}</p>
                      <div className="hike-detail-stop-meta">
                        <span>{formatTrailType(stop.stopType)}</span>
                        {stop.altitude ? <span>{stop.altitude} m</span> : null}
                        {stop.latLong?.length === 2 ? (
                          <span>{formatLatLong(stop.latLong)}</span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {hikeDetail.faqs?.length ? (
              <Card
                className="hike-detail-panel"
                bordered={false}
                style={{ marginTop: 24 }}
              >
                <Title level={3} className="hike-detail-section-title">
                  Frequently Asked Questions
                </Title>
                <Collapse
                  items={hikeDetail.faqs.map((faq, index) => ({
                    key: `${faq.question}-${index}`,
                    label: faq.question,
                    children: <p style={{ marginBottom: 0 }}>{faq.answer}</p>,
                  }))}
                  ghost
                />
              </Card>
            ) : null}
          </Col>

          <Col xs={24} xl={8}>
            <Card className="hike-detail-panel" bordered={false}>
              <Title level={3} className="hike-detail-section-title">
                Quick Facts
              </Title>
              <div className="hike-detail-side-list">
                <div className="hike-detail-side-row">
                  <span className="hike-detail-side-label">Difficulty</span>
                  <span className="hike-detail-side-value">
                    {hikeDetail.difficulty || "Not specified"}
                  </span>
                </div>
                <div className="hike-detail-side-row">
                  <span className="hike-detail-side-label">Trail Type</span>
                  <span className="hike-detail-side-value">
                    {formatTrailType(hikeDetail.trailType)}
                  </span>
                </div>
                <div className="hike-detail-side-row">
                  <span className="hike-detail-side-label">Walked Trail</span>
                  <span className="hike-detail-side-value">
                    {hikeDetail.isWalkedTrail ? "Yes" : "No"}
                  </span>
                </div>
                <div className="hike-detail-side-row">
                  <span className="hike-detail-side-label">Coordinates</span>
                  <span className="hike-detail-side-value">
                    {formatLatLong(hikeDetail.latLong)}
                  </span>
                </div>
                <div className="hike-detail-side-row">
                  <span className="hike-detail-side-label">Published</span>
                  <span className="hike-detail-side-value">
                    {hikeDetail.createdAt
                      ? dayjs(hikeDetail.createdAt).format("MMM D, YYYY")
                      : "Not available"}
                  </span>
                </div>
                <div className="hike-detail-side-row">
                  <span className="hike-detail-side-label">Updated</span>
                  <span className="hike-detail-side-value">
                    {hikeDetail.updatedAt
                      ? dayjs(hikeDetail.updatedAt).format("MMM D, YYYY")
                      : "Not available"}
                  </span>
                </div>
              </div>
            </Card>

            {hikeDetail.recommendedSeasons?.length ? (
              <Card
                className="hike-detail-panel"
                bordered={false}
                style={{ marginTop: 24 }}
              >
                <Title level={4} className="hike-detail-section-title">
                  Recommended Seasons
                </Title>
                <div className="hike-detail-tag-group">
                  {hikeDetail.recommendedSeasons.map((season) => (
                    <span key={season}>{season}</span>
                  ))}
                </div>
              </Card>
            ) : null}

            {hikeDetail.tags?.length ? (
              <Card
                className="hike-detail-panel"
                bordered={false}
                style={{ marginTop: 24 }}
              >
                <Title level={4} className="hike-detail-section-title">
                  Tags
                </Title>
                <div className="hike-detail-tag-group">
                  {hikeDetail.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </Card>
            ) : null}

            {hikeDetail.hikeRegion?.length ? (
              <Card
                className="hike-detail-panel"
                bordered={false}
                style={{ marginTop: 24 }}
              >
                <Title level={4} className="hike-detail-section-title">
                  Regions
                </Title>
                {hikeDetail.hikeRegion.map((region) => (
                  <div
                    key={region._id}
                    style={{
                      padding: "14px 0",
                      borderBottom: "1px solid rgba(19,32,34,0.08)",
                    }}
                  >
                    <Text strong style={{ display: "block", color: "#132022" }}>
                      {region.name}
                    </Text>
                    <Text type="secondary">
                      {[region.location, region.country].filter(Boolean).join(", ") ||
                        "Nepal"}
                    </Text>
                    {region.description ? (
                      <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                        {region.description}
                      </Paragraph>
                    ) : null}
                  </div>
                ))}
              </Card>
            ) : null}
          </Col>
        </Row>
      </MiddleContentWrapper>
    </div>
  );
};

export default HikeDetail;
