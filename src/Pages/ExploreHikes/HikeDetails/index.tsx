import React from "react";
import parse from "html-react-parser";
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
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
  FaSwimmer,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import { SEO } from "@/components/SEO";
import NoDataLottie from "@/components/Feedback/NoDataLottie";
import SuspensePageLoader from "@/components/Loaders/SuspensePageLoader";
import { useGetHikeBlogDetail } from "@/services/hikeServices/hikeServices";
import {
  TrekHikeStopType,
  STOP_MARKER_CONFIGS,
  DEFAULT_STOP_MARKER_CONFIG,
  formatStopTypeLabel,
} from "@/Pages/ExploreHikes/HikeTrailMap";
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

const getStopConfig = (stopType?: string) => {
  if (
    stopType &&
    Object.values(TrekHikeStopType).includes(stopType as TrekHikeStopType)
  ) {
    return (
      STOP_MARKER_CONFIGS[stopType as TrekHikeStopType] ||
      DEFAULT_STOP_MARKER_CONFIG
    );
  }
  return DEFAULT_STOP_MARKER_CONFIG;
};

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

  const essentialLogistics = [
    ...(hikeDetail.isBikeFriendly
      ? [
          {
            key: "bike-friendly",
            title: "Bike Friendly",
            description: hikeDetail.bikeRideDescription,
            icon: <FaBiking />,
          },
        ]
      : []),
    ...(hikeDetail.isWaterSourceAvailable
      ? [
          {
            key: "water-source",
            title: "Water Source",
            description: "Abundant water sources along the route.",
            icon: <FaTint />,
          },
        ]
      : []),
    ...(hikeDetail?.isSwimmingAvailable
      ? [
          {
            key: "swimming",
            title: "Swimming",
            description: hikeDetail?.swimmingDescription,
            icon: <FaSwimmer />,
          },
        ]
      : []),
    ...(hikeDetail.isPicnic
      ? [
          {
            key: "picnic",
            title: "Picnic Areas",
            description: hikeDetail.picnicDescription,
            icon: <FaUmbrellaBeach />,
          },
        ]
      : []),
    ...(hikeDetail.isCampingAllowed
      ? [
          {
            key: "camping",
            title: "Camping Allowed",
            description: hikeDetail.campingDescription,
            icon: <FaCampground />,
          },
        ]
      : []),
    ...(hikeDetail.isPermitRequired
      ? [
          {
            key: "permit",
            title: "Permit Required",
            description: hikeDetail.permitDetailDescription,
            icon: <FaTicketAlt />,
          },
        ]
      : []),
  ];

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

              {hikeDetail.hikingStops?.length ? (
                <Card className="hike-detail-panel" bordered={false}>
                  <Title level={3} className="hike-detail-section-title">
                    Hiking Stops
                  </Title>
                  <Row gutter={[14, 14]} align="stretch">
                    {hikeDetail?.hikingStops?.map((stop) => {
                      const stopConfig = getStopConfig(stop.stopType);
                      const Icon = stopConfig.icon;

                      return (
                        <Col
                          xs={24}
                          md={12}
                          lg={8}
                          xl={6}
                          key={stop._id}
                          style={{ display: "flex" }}
                        >
                          <Card
                            size="small"
                            className="hike-detail-inner-card"
                            bordered={false}
                            style={{
                              width: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                            bodyStyle={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                            }}
                            styles={{
                              body: {
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                              },
                            }}
                          >
                            <Flex
                              vertical
                              gap={12}
                              style={{ width: "100%", height: "100%" }}
                            >
                              <Flex gap={10} align="center">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    backgroundColor: stopConfig.accent,
                                    color: "#fff",
                                  }}
                                >
                                  <Icon />
                                </div>
                                <Title level={5} style={{ margin: 0 }}>
                                  {stop.title ||
                                    formatStopTypeLabel(stop.stopType)}
                                </Title>
                              </Flex>

                              {stop.htmlDescription ? (
                                <div className="hike-html-content hike-html-content--compact">
                                  {parse(stop.htmlDescription)}
                                </div>
                              ) : null}

                              <div style={{ marginTop: "auto" }}>
                                <Flex gap={8} wrap>
                                  <Tag bordered={false} color="green">
                                    {formatStopTypeLabel(stop.stopType)}
                                  </Tag>
                                  {stop.altitude ? (
                                    <Tag bordered={false} color="gold">
                                      {stop.altitude} m
                                    </Tag>
                                  ) : null}
                                </Flex>
                              </div>
                            </Flex>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                  <div className="m-2">
                    <Alert
                      type={"success"}
                      message="You can explore the stops more precisely through  Maps."
                    />
                  </div>
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

                        <Flex justify="center" align="center" gap={16} wrap>
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
                        </Flex>
                      </Space>
                    </div>
                  </div>
                </Card>
              ) : null}

              {essentialLogistics.length > 0 ? (
                <Card
                  className="hike-detail-panel hike-essential-logistics-card"
                  bordered={false}
                >
                  <Title level={3} className="hike-detail-section-title">
                    Trail Amenities and Accessibility
                  </Title>
                  <Divider style={{ margin: "14px 0 0" }} />
                  <List
                    itemLayout="horizontal"
                    dataSource={essentialLogistics}
                    split={false}
                    renderItem={(item) => (
                      <List.Item className="hike-essential-logistics-item">
                        <List.Item.Meta
                          avatar={
                            <div className="hike-essential-logistics-icon">
                              {item.icon}
                            </div>
                          }
                          title={
                            <span className="hike-essential-logistics-title">
                              {item.title}
                            </span>
                          }
                          description={
                            item.description ? (
                              <span className="hike-essential-logistics-desc">
                                {item.description}
                              </span>
                            ) : null
                          }
                        />
                      </List.Item>
                    )}
                  />
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
            </Flex>
          </Col>
        </Row>
        {hikeDetail.faqs?.length ? (
          <Card className="hike-detail-panel my-4" bordered={false}>
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
      </MiddleContentWrapper>
    </div>
  );
};

export default HikeDetail;
