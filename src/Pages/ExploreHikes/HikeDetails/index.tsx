import React from "react";
import parse from "html-react-parser";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Flex,
  Image,
  List,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowRightOutlined,
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

  const normalizedPath = assetPath.startsWith("/")
    ? assetPath
    : `/${assetPath}`;
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
      ? hikeDetail.permitDetailDescription ||
        "Permit is required for this hike."
      : "No permit requirement was listed.",
    icon: <FaTicketAlt />,
  },
  {
    title: "Picnic",
    description: hikeDetail.isPicnic
      ? hikeDetail.picnicDescription ||
        "Suitable spots are available for a picnic break."
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
      ? hikeDetail.bikeRideDescription ||
        "Bike-friendly sections are available."
      : "This route is not marked as bike-friendly.",
    icon: <FaBiking />,
  },
];

const HikeDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: hikeDetailResponse, isLoading } = useGetHikeBlogDetail(
    slug || "",
  );

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
    hikeDetail.categories?.map((category) => category.title).filter(Boolean) ||
    [];
  const seoTitle =
    hikeDetail.metaTitle ||
    `${hikeDetail.title} Hike | ${hikeDetail.difficulty || "Scenic"} route in ${regionNames[0] || "Nepal"}`;
  const seoDescription =
    hikeDetail.metaDescription ||
    hikeDetail.shortSlogan ||
    "Plan your next hike with route facts, blog sections, and trail highlights.";
  const featureCards = buildFeatureCards(hikeDetail);
  const heroBadges = [
    ...(hikeDetail.difficulty ? [hikeDetail.difficulty] : []),
    ...categoryTitles,
    ...regionNames,
  ];
  const summaryItems = [
    {
      key: "altitude",
      icon: <FaMountain />,
      label: hikeDetail.maxAltitudeMeter
        ? `${hikeDetail.maxAltitudeMeter} m max altitude`
        : "Altitude not specified",
    },
    {
      key: "distance",
      icon: <FaRoute />,
      label: hikeDetail.trailDistanceKm
        ? `${hikeDetail.trailDistanceKm} km trail`
        : "Distance not specified",
    },
    {
      key: "trail-type",
      icon: <FaMapMarkedAlt />,
      label: formatTrailType(hikeDetail.trailType),
    },
    {
      key: "region",
      icon: <EnvironmentOutlined />,
      label: regionNames.join(" • ") || "Nepal",
    },
  ];
  const statCards = [
    {
      key: "trail-distance",
      title: "Trail Distance",
      value: hikeDetail.trailDistanceKm
        ? `${hikeDetail.trailDistanceKm} km`
        : "N/A",
      prefix: <FaRoute />,
    },
    {
      key: "max-altitude",
      title: "Max Altitude",
      value: hikeDetail.maxAltitudeMeter
        ? `${hikeDetail.maxAltitudeMeter} m`
        : "N/A",
      prefix: <FaMountain />,
    },
    {
      key: "best-seasons",
      title: "Best Seasons",
      value: hikeDetail.recommendedSeasons?.join(", ") || "All seasons",
      prefix: <FaRegCalendarAlt />,
    },
    {
      key: "route-style",
      title: "Route Style",
      value: formatTrailType(hikeDetail.trailType),
      prefix: <FaMapMarkedAlt />,
    },
  ];
  const quickFacts = [
    {
      key: "difficulty",
      label: "Difficulty",
      value: hikeDetail.difficulty || "Not specified",
    },
    {
      key: "trail-type",
      label: "Trail Type",
      value: formatTrailType(hikeDetail.trailType),
    },
    {
      key: "walked-trail",
      label: "Walked Trail",
      value: hikeDetail.isWalkedTrail ? "Yes" : "No",
    },
    {
      key: "coordinates",
      label: "Coordinates",
      value: formatLatLong(hikeDetail.latLong),
    },
    {
      key: "published",
      label: "Published",
      value: hikeDetail.createdAt
        ? dayjs(hikeDetail.createdAt).format("MMM D, YYYY")
        : "Not available",
    },
    {
      key: "updated",
      label: "Updated",
      value: hikeDetail.updatedAt
        ? dayjs(hikeDetail.updatedAt).format("MMM D, YYYY")
        : "Not available",
    },
  ];
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

  const handleMapCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenMap();
    }
  };

  return (
    <div className="hike-detail-page">
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

      <section className="hike-detail-hero">
        <img
          src={buildAssetUrl(hikeDetail.featuredImage?.path)}
          alt={hikeDetail.title}
          className="hike-detail-hero__image"
        />
        <div className="hike-detail-hero__overlay" />
        <div className="hike-detail-hero__content">
          <MiddleContentWrapper extraStyles={{ overflow: "visible" }}>
            <Flex className="hike-detail-badges" gap={10} wrap>
              {heroBadges.map((badge) => (
                <Tag key={badge} bordered={false} className="hike-detail-badge">
                  {badge}
                </Tag>
              ))}
            </Flex>

            <Title level={1} className="hike-detail-title">
              {hikeDetail.title}
            </Title>
            <Paragraph className="hike-detail-subtitle">
              {hikeDetail.shortSlogan ||
                "A practical overview of the route, trail character, and essential planning details."}
            </Paragraph>

            <Flex className="hike-detail-summary" gap={12} wrap>
              {summaryItems?.map((item) => (
                <Tag
                  key={item.key}
                  bordered={false}
                  className="hike-detail-summary__item"
                >
                  {item.icon}
                  {item.label}
                </Tag>
              ))}
            </Flex>

            <Flex className="hike-detail-actions" gap={12} wrap>
              <Button icon={<ShareAltOutlined />} onClick={handleShare}>
                Share Hike
              </Button>
            </Flex>
          </MiddleContentWrapper>
        </div>
      </section>

      <MiddleContentWrapper>
        <Row gutter={[18, 18]} className="hike-detail-stats">
          {statCards.map((stat) => (
            <Col xs={24} sm={12} xl={6} key={stat.key}>
              <Card
                className="hike-detail-panel hike-detail-stat-card"
                bordered={false}
              >
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.prefix}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 24]} align="stretch">
          <Col xs={24} xl={16}>
            <Flex vertical gap={24}>
              <Card className="hike-detail-panel" bordered={false}>
                <Title level={3} className="hike-detail-section-title">
                  Overview
                </Title>

                {hikeDetail.blogContent?.length ? (
                  hikeDetail.blogContent.map((section, index) => (
                    <div key={`${section.title}-${index}`}>
                      <Title level={4}>{section.title}</Title>

                      {section.images?.length ? (
                        <Image.PreviewGroup>
                          <Row
                            gutter={[14, 14]}
                            className="hike-detail-image-grid"
                          >
                            {section.images.map((image) => (
                              <Col xs={24} md={12} key={image._id}>
                                <Image
                                  src={buildAssetUrl(image.path)}
                                  alt={`${section.title} visual`}
                                  className="hike-detail-image"
                                />
                              </Col>
                            ))}
                          </Row>
                        </Image.PreviewGroup>
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
                    <List
                      dataSource={hikeDetail.highlights}
                      renderItem={(highlight) => (
                        <List.Item>
                          <Text>{highlight}</Text>
                        </List.Item>
                      )}
                    />
                  </>
                ) : null}
              </Card>

              <Card className="hike-detail-panel" bordered={false}>
                <Title level={3} className="hike-detail-section-title">
                  Trail Conditions & Planning
                </Title>
                <List
                  grid={{ gutter: 14, xs: 1, md: 2 }}
                  dataSource={featureCards}
                  renderItem={(feature) => (
                    <List.Item key={feature.title}>
                      <Card
                        size="small"
                        className="hike-detail-inner-card"
                        bordered={false}
                      >
                        <Space
                          direction="vertical"
                          size={10}
                          style={{ width: "100%" }}
                        >
                          <Tag
                            bordered={false}
                            color="green"
                            style={{ width: "fit-content", borderRadius: 999 }}
                          >
                            {feature.icon} {feature.title}
                          </Tag>
                          <Title level={5} style={{ margin: 0 }}>
                            {feature.title}
                          </Title>
                          <Paragraph
                            type="secondary"
                            style={{ marginBottom: 0 }}
                          >
                            {feature.description}
                          </Paragraph>
                        </Space>
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>

              {hikeDetail.hikingStops?.length ? (
                <Card className="hike-detail-panel" bordered={false}>
                  <Title level={3} className="hike-detail-section-title">
                    Hiking Stops
                  </Title>
                  <List
                    grid={{ gutter: 14, xs: 1, md: 2 }}
                    dataSource={hikeDetail.hikingStops}
                    renderItem={(stop) => (
                      <List.Item key={stop._id}>
                        <Card
                          size="small"
                          className="hike-detail-inner-card"
                          bordered={false}
                        >
                          <Space
                            direction="vertical"
                            size={12}
                            style={{ width: "100%" }}
                          >
                            <Title level={5} style={{ margin: 0 }}>
                              {stop.title}
                            </Title>
                            <div className="hike-html-content hike-html-content--compact">
                              {parse(
                                stop.htmlDescription ||
                                  "<p>No description available.</p>",
                              )}
                            </div>
                            <Flex gap={8} wrap>
                              <Tag bordered={false} color="green">
                                {formatTrailType(stop.stopType)}
                              </Tag>
                              {stop.altitude ? (
                                <Tag bordered={false} color="gold">
                                  {stop.altitude} m
                                </Tag>
                              ) : null}
                              {stop.latLong?.length === 2 ? (
                                <Tag bordered={false} color="cyan">
                                  {formatLatLong(stop.latLong)}
                                </Tag>
                              ) : null}
                            </Flex>
                          </Space>
                        </Card>
                      </List.Item>
                    )}
                  />
                </Card>
              ) : null}

              {hikeDetail.faqs?.length ? (
                <Card className="hike-detail-panel" bordered={false}>
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
            </Flex>
          </Col>

          <Col xs={24} xl={8}>
            <Flex vertical gap={24}>
              {hikeDetail.kmlFile?.path ? (
                <Card
                  bordered={false}
                  hoverable
                  className="hike-map-preview-card"
                  bodyStyle={{ padding: 0 }}
                >
                  <div
                    className="hike-map-preview-surface"
                    role="button"
                    tabIndex={0}
                    aria-label={`Open interactive hike map for ${hikeDetail.title}`}
                    onClick={handleOpenMap}
                    onKeyDown={handleMapCardKeyDown}
                  >
                    <img
                      src="/images/hike-map-preview.png"
                      alt="Hike map preview"
                      className="hike-map-preview-image"
                    />
                    <div className="hike-map-preview-overlay" />
                    <div className="hike-map-preview-content">
                      <Flex gap={10} wrap>
                        <Tag className="hike-map-preview-tag" bordered={false}>
                          Interactive Route
                        </Tag>
                        {hikeDetail.hikingStops?.length ? (
                          <Tag
                            className="hike-map-preview-tag hike-map-preview-tag--success"
                            bordered={false}
                          >
                            {hikeDetail.hikingStops.length} Hiking Stops
                          </Tag>
                        ) : null}
                      </Flex>

                      <Space
                        direction="vertical"
                        size={12}
                        style={{ width: "100%" }}
                      >
                        <div>
                          <Title level={4} className="hike-map-preview-title">
                            Explore Hike Map & Route Stops
                          </Title>
                          <Paragraph className="hike-map-preview-description">
                            Open the full route view, inspect mapped hike stops,
                            and jump into the interactive map experience for
                            this hike.
                          </Paragraph>
                        </div>

                        <Flex
                          justify="space-between"
                          align="center"
                          gap={16}
                          wrap
                        >
                          <Button
                            type="primary"
                            size="large"
                            icon={<FaMapMarkedAlt />}
                            className="hike-map-preview-button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOpenMap();
                            }}
                          >
                            Explore Hike Map
                          </Button>

                          <div className="hike-map-preview-hint">
                            <span>Open full screen map</span>
                            <span className="hike-map-preview-arrow">
                              <ArrowRightOutlined />
                            </span>
                          </div>
                        </Flex>
                      </Space>
                    </div>
                  </div>
                </Card>
              ) : null}

              <Card className="hike-detail-panel" bordered={false}>
                <Title level={3} className="hike-detail-section-title">
                  Quick Facts
                </Title>
                <Descriptions
                  column={1}
                  colon={false}
                  className="hike-detail-descriptions"
                >
                  {quickFacts.map((fact) => (
                    <Descriptions.Item key={fact.key} label={fact.label}>
                      {fact.value}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Card>

              {hikeDetail.recommendedSeasons?.length ? (
                <Card className="hike-detail-panel" bordered={false}>
                  <Title level={4} className="hike-detail-section-title">
                    Recommended Seasons
                  </Title>
                  <Flex className="hike-detail-tag-group" gap={10} wrap>
                    {hikeDetail.recommendedSeasons.map((season) => (
                      <Tag
                        key={season}
                        bordered={false}
                        className="hike-detail-meta-tag"
                      >
                        {season}
                      </Tag>
                    ))}
                  </Flex>
                </Card>
              ) : null}

              {hikeDetail.tags?.length ? (
                <Card className="hike-detail-panel" bordered={false}>
                  <Title level={4} className="hike-detail-section-title">
                    Tags
                  </Title>
                  <Flex className="hike-detail-tag-group" gap={10} wrap>
                    {hikeDetail.tags.map((tag) => (
                      <Tag
                        key={tag}
                        bordered={false}
                        className="hike-detail-meta-tag"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </Flex>
                </Card>
              ) : null}

              {hikeDetail.hikeRegion?.length ? (
                <Card className="hike-detail-panel" bordered={false}>
                  <Title level={4} className="hike-detail-section-title">
                    Regions
                  </Title>
                  <List
                    dataSource={hikeDetail.hikeRegion}
                    renderItem={(region) => (
                      <List.Item key={region._id}>
                        <Space
                          direction="vertical"
                          size={4}
                          style={{ width: "100%" }}
                        >
                          <Text strong className="hike-detail-region-title">
                            {region.name}
                          </Text>
                          <Text type="secondary">
                            {[region.location, region.country]
                              .filter(Boolean)
                              .join(", ") || "Nepal"}
                          </Text>
                          {region.description ? (
                            <Paragraph style={{ marginBottom: 0 }}>
                              {region.description}
                            </Paragraph>
                          ) : null}
                        </Space>
                      </List.Item>
                    )}
                  />
                </Card>
              ) : null}
            </Flex>
          </Col>
        </Row>
      </MiddleContentWrapper>
    </div>
  );
};

export default HikeDetail;
