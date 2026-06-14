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
  List,
  Row,
  Space,
  Tag,
  Typography,
  message,
  Carousel,
} from "antd";
import {
  ShareAltOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  FaMapMarkerAlt,
  FaMoon,
  FaTicketAlt,
  FaCalendarAlt,
  FaUsers,
  FaGem,
  FaGlobeAsia,
  FaRoute,
  FaTag,
  FaCamera,
  FaYoutube,
  FaMountain,
} from "react-icons/fa";
import { MdLocationOn, MdVerified } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import { SEO } from "@/components/SEO";
import NoDataLottie from "@/components/Feedback/NoDataLottie";
import SuspensePageLoader from "@/components/Loaders/SuspensePageLoader";
import { useFetchOutingBlogDetail } from "@/services/outingServices";

const { Title, Text, Paragraph } = Typography;

const BASE_API_URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544634076-a90160ddf44a?q=80&w=2000&auto=format&fit=crop";

const buildAssetUrl = (assetPath?: string) => {
  if (!assetPath) return FALLBACK_IMAGE;
  if (assetPath.startsWith("http://") || assetPath.startsWith("https://"))
    return assetPath;
  const normalizedPath = assetPath.startsWith("/")
    ? assetPath
    : `/${assetPath}`;
  return `${BASE_API_URL}${normalizedPath}`;
};

const copyTextToClipboard = async (value: string) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);
  if (!copied) throw new Error("Unable to copy link");
};

const formatLabel = (value?: string) => {
  if (!value) return "";
  return value
    .split("_")
    .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
    .join(" ");
};

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <Button
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.3)",
        border: "none",
        color: "#fff",
        zIndex: 10,
        transition: "all 0.3s",
      }}
      shape="circle"
      icon={<RightOutlined style={{ fontSize: "20px" }} />}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <Button
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.3)",
        border: "none",
        color: "#fff",
        zIndex: 10,
        transition: "all 0.3s",
      }}
      shape="circle"
      icon={<LeftOutlined style={{ fontSize: "20px" }} />}
      onClick={onClick}
    />
  );
};

const OutingDetails: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: outingDetailResponse, isLoading } = useFetchOutingBlogDetail(
    slug || "",
  );

  if (isLoading) return <SuspensePageLoader />;

  const outing = outingDetailResponse?.data;

  if (!outing) return <NoDataLottie title="Outing not found." />;

  const regionNames =
    (outing.region?.map((r: any) => r.name).filter(Boolean) as string[]) || [];
  const categoryTitles =
    (outing.categories?.map((c: any) => c.title).filter(Boolean) as string[]) ||
    [];

  const seoTitle = `${outing.title} | Discover Outings in Nepal`;
  const seoDescription =
    outing.shortSlogan ||
    "Explore this amazing destination with detailed travel information.";

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
        name: "Outings",
        item: `${window.location.origin}/outings`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: outing.title,
        item: window.location.href,
      },
    ],
  };

  const faqSchema = outing.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: outing.faqs.map((faq: any) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
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

  /* ── Stat Cards ── */
  const statCards = [
    ...(outing.recommendedSeasons?.length
      ? [
          {
            key: "seasons",
            title: "Best Seasons",
            value: outing.recommendedSeasons.join(", "),
            icon: <FaCalendarAlt />,
          },
        ]
      : []),
    ...(outing.travelType?.length
      ? [
          {
            key: "travel-type",
            title: "Travel Type",
            value: outing.travelType.map(formatLabel).join(", "),
            icon: <FaUsers />,
          },
        ]
      : []),
    ...(outing.destinationType?.length
      ? [
          {
            key: "destination-type",
            title: "Destination Type",
            value: outing.destinationType.map(formatLabel).join(", "),
            icon: <FaGlobeAsia />,
          },
        ]
      : []),
    ...(outing.nearestTown
      ? [
          {
            key: "nearest-town",
            title: "Nearest Town",
            value:
              outing.nearestTown.distanceKm && outing.nearestTown.distanceKm > 0
                ? `${outing.nearestTown.name} (${outing.nearestTown.distanceKm} km)`
                : outing.nearestTown.name,
            icon: <FaRoute />,
          },
        ]
      : []),
    ...(outing.altitude && outing.altitude > 1800
      ? [
          {
            key: "altitude",
            title: "Elevation",
            value: `${outing.altitude} m`,
            icon: <FaMountain />,
          },
        ]
      : []),
  ];

  /* ── Info Badges ── */
  const badgeStyle = (
    bgColor: string,
    textColor: string,
    borderColor: string,
  ) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    background: bgColor,
    color: textColor,
    border: `1px solid ${borderColor}`,
    backdropFilter: "blur(4px)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    margin: "4px",
  });

  const infoBadges: React.ReactNode[] = [
    ...(outing.isHiddenGem
      ? [
          <div
            key="gem"
            style={badgeStyle("#4e7d35ff", "#ffffff", "#cce0c0ff")}
          >
            <FaGem /> Hidden Gem
          </div>,
        ]
      : []),
    ...(outing.isUnescoSite
      ? [
          <div key="unesco" style={badgeStyle("#dbeafe", "#1e40af", "#bfdbfe")}>
            <MdVerified /> UNESCO Site
          </div>,
        ]
      : []),
    ...(outing.isNightOut?.isNightOutPlace
      ? [
          <div key="night" style={badgeStyle("#f3e8ff", "#6b21a8", "#e9d5ff")}>
            <FaMoon /> Night Out
          </div>,
        ]
      : []),
    ...(outing.isEntryFeeRequired
      ? [
          <div key="fee" style={badgeStyle("#ffedd5", "#9a3412", "#fed7aa")}>
            <FaTicketAlt /> Fee Required
          </div>,
        ]
      : []),
    ...categoryTitles.map((cat: string) => (
      <div key={cat} style={badgeStyle("#f1f5f9", "#334155", "#e2e8f0")}>
        {cat}
      </div>
    )),
  ];

  const hasOpeningHours =
    outing.openingHours &&
    (outing.openingHours.isAlwaysOpen || outing.openingHours.openTime);
  const showYoutubeEmbed =
    outing.youtubeLink && outing.youtubeLink.includes("youtube.com");

  const extractYoutubeId = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  return (
    <div className="outing-detail-page">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={`${window.location.origin}/outings-detail/${outing.slug}`}
        keywords={[
          outing.title,
          ...regionNames,
          ...categoryTitles,
          ...(outing.tags || []),
        ]}
        ogImage={buildAssetUrl(outing.featuredImage?.path)}
        schema={[breadcrumbsSchema, faqSchema].filter(Boolean)}
        openGraphType="article"
      />

      {/* ── Hero Section ── */}
      <section className="outing-detail-hero">
        <img
          src={buildAssetUrl(outing.featuredImage?.path)}
          alt={outing.title}
          className="outing-detail-hero__image"
        />
        <div className="outing-detail-hero__overlay" />
        <div className="outing-detail-hero__content">
          <MiddleContentWrapper extraStyles={{ overflow: "visible" }}>
            <Flex gap={8} wrap style={{ marginBottom: 16 }}>
              {infoBadges}
            </Flex>

            <Title level={1} className="outing-detail-title">
              {outing.title}
            </Title>

            {outing.shortSlogan && (
              <Paragraph className="outing-detail-subtitle">
                {outing.shortSlogan}
              </Paragraph>
            )}

            {regionNames.length > 0 && (
              <Flex gap={8} align="center" wrap style={{ marginBottom: 20 }}>
                <MdLocationOn style={{ color: "#2ecc71", fontSize: 20 }} />
                {regionNames.map((name: string, idx: number) => (
                  <Text
                    key={name}
                    style={{ color: "#eee", fontSize: 16, fontWeight: 500 }}
                  >
                    {name}
                    {idx < regionNames.length - 1 ? " • " : ""}
                  </Text>
                ))}
              </Flex>
            )}

            <Flex justify="end" gap={12} wrap>
              <Button
                icon={<ShareAltOutlined />}
                onClick={handleShare}
                size="large"
              >
                Share
              </Button>
              
            </Flex>
          </MiddleContentWrapper>
        </div>
      </section>

      <MiddleContentWrapper>
        {/* ── Stat Cards ── */}
        {statCards.length > 0 && (
          <div className="outing-stats-grid" style={{ margin: "28px 0 36px" }}>
            {statCards.map((stat) => (
              <Card
                key={stat.key}
                bordered={false}
                className="outing-stat-card"
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{ color: "#2ecc71", fontSize: 22, marginBottom: 10 }}
                >
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#A0AEC0",
                    fontWeight: 700,
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {stat.title}
                </div>
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: "#2D3748" }}
                >
                  {stat.value}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Row gutter={[24, 24]} align="top">
          {/* ── Main Column ── */}
          <Col xs={24} xl={16}>
            <Flex vertical gap={24}>
              {/* Blog Content */}
              <Card className="outing-detail-panel" bordered={false}>
                <Title level={3} className="outing-detail-section-title">
                  Overview
                </Title>

                {outing.blogContent?.length ? (
                  outing.blogContent.map((section: any, index: number) => (
                    <div key={`${section.title}-${index}`}>
                      <Title level={4}>{section.title}</Title>

                      {section.images?.length ? (
                        <div
                          style={{
                            marginBottom: "24px",
                            borderRadius: "12px",
                            overflow: "hidden",
                          }}
                        >
                          <Carousel
                            autoplay
                            effect="fade"
                            arrows={section.images.length >= 2}
                            nextArrow={<NextArrow />}
                            prevArrow={<PrevArrow />}
                          >
                            {section.images.map((image: any, i: number) => (
                              <div key={image._id || i}>
                                <img
                                  src={buildAssetUrl(image.path)}
                                  alt={`${section.title} visual ${i}`}
                                  loading="lazy"
                                  style={{
                                    width: "100%",
                                    height: "400px",
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                  }}
                                />
                              </div>
                            ))}
                          </Carousel>
                        </div>
                      ) : null}

                      <div className="outing-html-content">
                        {parse(section.htmlDescription || "")}
                      </div>

                      {index < (outing.blogContent?.length || 0) - 1 && (
                        <Divider />
                      )}
                    </div>
                  ))
                ) : (
                  <Paragraph type="secondary">
                    Detailed content has not been added yet.
                  </Paragraph>
                )}

                {/* Highlights */}
                {outing.highlights?.length ? (
                  <>
                    <Divider />
                    <Title level={4}>Highlights</Title>
                    <List
                      dataSource={outing.highlights}
                      renderItem={(item: string) => (
                        <List.Item
                          style={{
                            padding: "8px 0",
                            borderBottom: "1px solid #f5f5f5",
                          }}
                        >
                          <Flex gap={10} align="flex-start">
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#2ecc71",
                                marginTop: 6,
                                flexShrink: 0,
                              }}
                            />
                            <Text>{item}</Text>
                          </Flex>
                        </List.Item>
                      )}
                    />
                  </>
                ) : null}
              </Card>

              {/* Night Out Info */}
              {outing.isNightOut?.isNightOutPlace &&
                outing.isNightOut.description && (
                  <Card
                    bordered={false}
                    className="outing-detail-panel"
                    style={{
                      background:
                        "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                      color: "#fff",
                    }}
                  >
                    <Flex gap={12} align="center" style={{ marginBottom: 12 }}>
                      <FaMoon style={{ color: "#fef08a", fontSize: 20 }} />
                      <Title level={4} style={{ color: "#fff", margin: 0 }}>
                        Night Out Experience
                      </Title>
                    </Flex>
                    <Paragraph style={{ color: "#cbd5e1", marginBottom: 0 }}>
                      {outing.isNightOut.description}
                    </Paragraph>
                  </Card>
                )}

              {/* YouTube Video */}
              {showYoutubeEmbed && (
                <Card bordered={false} className="outing-detail-panel">
                  <Flex gap={10} align="center" style={{ marginBottom: 16 }}>
                    <FaYoutube style={{ color: "#FF0000", fontSize: 22 }} />
                    <Title level={4} style={{ margin: 0 }}>
                      Watch Video
                    </Title>
                  </Flex>
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "56.25%",
                      height: 0,
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYoutubeId(outing.youtubeLink)}`}
                      title={outing.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                    />
                  </div>
                </Card>
              )}

              {/* FAQs */}
              {outing.faqs?.length ? (
                <Card className="outing-detail-panel" bordered={false}>
                  <Title level={3} className="outing-detail-section-title">
                    Frequently Asked Questions
                  </Title>
                  <Collapse
                    ghost
                    items={outing.faqs.map((faq: any, index: number) => ({
                      key: `${faq.question}-${index}`,
                      label: <Text strong>{faq.question}</Text>,
                      children: (
                        <Paragraph
                          style={{ marginBottom: 0, color: "#4A5568" }}
                        >
                          {faq.answer}
                        </Paragraph>
                      ),
                    }))}
                  />
                </Card>
              ) : null}
            </Flex>
          </Col>

          {/* ── Sidebar Column ── */}
          <Col xs={24} xl={8}>
            <Flex vertical gap={20}>
              {/* Opening Hours */}
              {hasOpeningHours && (
                <Card bordered={false} className="outing-detail-panel">
                  <Flex gap={10} align="center" style={{ marginBottom: 14 }}>
                    <ClockCircleOutlined
                      style={{ color: "#2ecc71", fontSize: 18 }}
                    />
                    <Title level={4} style={{ margin: 0 }}>
                      Opening Hours
                    </Title>
                  </Flex>
                  {outing.openingHours.isAlwaysOpen ? (
                    <Tag
                      color="green"
                      style={{ fontSize: 14, padding: "4px 12px" }}
                    >
                      Open 24/7
                    </Tag>
                  ) : (
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Flex justify="space-between">
                        <Text type="secondary">Opens</Text>
                        <Text strong>{outing.openingHours.openTime}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text type="secondary">Closes</Text>
                        <Text strong>{outing.openingHours.closeTime}</Text>
                      </Flex>
                      {outing.openingHours.closedDays?.length > 0 && (
                        <Flex justify="space-between" align="flex-start">
                          <Text type="secondary">Closed</Text>
                          <Text strong style={{ textAlign: "right" }}>
                            {outing.openingHours.closedDays.join(", ")}
                          </Text>
                        </Flex>
                      )}
                      {outing.openingHours.remarks && (
                        <Alert
                          type="info"
                          message={outing.openingHours.remarks}
                          icon={<InfoCircleOutlined />}
                          showIcon
                          style={{ marginTop: 8, fontSize: 12 }}
                        />
                      )}
                    </Space>
                  )}
                </Card>
              )}

              {/* Entry Fee */}
              {outing.isEntryFeeRequired && outing.entryFeeDescription && (
                <Card bordered={false} className="outing-detail-panel">
                  <Flex gap={10} align="center" style={{ marginBottom: 14 }}>
                    <FaTicketAlt style={{ color: "#f59e0b", fontSize: 18 }} />
                    <Title level={4} style={{ margin: 0 }}>
                      Entry Fee
                    </Title>
                  </Flex>
                  <Alert
                    type="warning"
                    message={outing.entryFeeDescription}
                    showIcon
                    style={{ fontSize: 12 }}
                  />
                </Card>
              )}

              {/* Nearest Town */}
              {outing.nearestTown && (
                <Card bordered={false} className="outing-detail-panel">
                  <Flex gap={10} align="center" style={{ marginBottom: 14 }}>
                    <FaMapMarkerAlt
                      style={{ color: "#3b82f6", fontSize: 18 }}
                    />
                    <Title level={4} style={{ margin: 0 }}>
                      Getting There
                    </Title>
                  </Flex>
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={8}
                  >
                    <Flex justify="space-between">
                      <Text type="secondary">Nearest Town</Text>
                      <Text strong>{outing.nearestTown.name}</Text>
                    </Flex>
                    {outing.nearestTown.distanceKm &&
                    outing.nearestTown.distanceKm > 0 ? (
                      <Flex justify="space-between">
                        <Text type="secondary">Distance</Text>
                        <Text strong>{outing.nearestTown.distanceKm} km</Text>
                      </Flex>
                    ) : null}
                    {outing.altitude && outing.altitude > 0 ? (
                      <Flex justify="space-between">
                        <Text type="secondary">Elevation</Text>
                        <Text strong>{outing.altitude} m</Text>
                      </Flex>
                    ) : null}
                  </Space>
                </Card>
              )}

              {/* Region Info */}
              {outing.region?.length > 0 && (
                <Card bordered={false} className="outing-detail-panel">
                  <Flex gap={10} align="center" style={{ marginBottom: 14 }}>
                    <FaGlobeAsia style={{ color: "#8b5cf6", fontSize: 18 }} />
                    <Title level={4} style={{ margin: 0 }}>
                      Region
                    </Title>
                  </Flex>
                  {outing.region.map((r: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: i < outing.region.length - 1 ? 12 : 0,
                      }}
                    >
                      <Text strong style={{ fontSize: 14 }}>
                        {r.name}
                      </Text>
                      {r.country && (
                        <Text
                          type="secondary"
                          style={{ display: "block", fontSize: 12 }}
                        >
                          {r.location || r.country}
                        </Text>
                      )}
                      {r.description && (
                        <Paragraph
                          type="secondary"
                          style={{
                            fontSize: 12,
                            marginTop: 4,
                            marginBottom: 0,
                          }}
                        >
                          {r.description}
                        </Paragraph>
                      )}
                    </div>
                  ))}
                </Card>
              )}

              {/* Categories */}
              {outing.categories?.length > 0 && (
                <Card bordered={false} className="outing-detail-panel">
                  <Flex gap={10} align="center" style={{ marginBottom: 14 }}>
                    <FaCamera style={{ color: "#10b981", fontSize: 18 }} />
                    <Title level={4} style={{ margin: 0 }}>
                      Categories
                    </Title>
                  </Flex>
                  <Flex gap={8} wrap>
                    {outing.categories.map((cat: any) => (
                      <Tag
                        key={cat.slug}
                        color="green"
                        style={{ marginBottom: 4 }}
                      >
                        {cat.title}
                      </Tag>
                    ))}
                  </Flex>
                </Card>
              )}

              {/* Tags */}
              {outing.tags?.length > 0 && (
                <Card bordered={false} className="outing-detail-panel">
                  <Flex gap={10} align="center" style={{ marginBottom: 14 }}>
                    <FaTag style={{ color: "#6366f1", fontSize: 16 }} />
                    <Title level={4} style={{ margin: 0 }}>
                      Tags
                    </Title>
                  </Flex>
                  <Flex gap={8} wrap>
                    {outing.tags.map((tag: string) => (
                      <Tag
                        key={tag}
                        bordered={false}
                        style={{ background: "#f1f5f9", color: "#64748b" }}
                      >
                        #{tag}
                      </Tag>
                    ))}
                  </Flex>
                </Card>
              )}

              {/* YouTube link button (non-embed) */}
              {outing.youtubeLink && !showYoutubeEmbed && (
                <Card
                  bordered={false}
                  className="outing-detail-panel"
                  style={{ textAlign: "center" }}
                >
                  <FaYoutube
                    style={{ color: "#FF0000", fontSize: 32, marginBottom: 8 }}
                  />
                  <Title level={5} style={{ marginBottom: 12 }}>
                    Watch on YouTube
                  </Title>
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    href={outing.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    danger
                    block
                  >
                    Watch Video
                  </Button>
                </Card>
              )}

              {/* Featured Video */}
              {outing.featuredVideo?.path && (
                <Card bordered={false} className="outing-detail-panel">
                  <Title level={4} style={{ marginBottom: 12 }}>
                    Featured Video
                  </Title>
                  <video
                    src={buildAssetUrl(outing.featuredVideo.path)}
                    controls
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                </Card>
              )}
            </Flex>
          </Col>
        </Row>
      </MiddleContentWrapper>

      <style>{`
        .outing-detail-page {
          min-height: 100vh;
          background: #f8fafc;
        }
        .outing-detail-hero {
          position: relative;
          height: 520px;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .outing-detail-hero { height: 400px; }
          .outing-detail-title { font-size: 28px !important; }
        }
        .outing-detail-hero__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .outing-detail-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
        }
        .outing-detail-hero__content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding-bottom: 40px;
        }
        .outing-detail-title {
          color: #ffffff !important;
          font-size: 40px !important;
          font-weight: 800 !important;
          line-height: 1.2 !important;
          margin-bottom: 12px !important;
          text-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }
        .outing-detail-subtitle {
          color: rgba(255,255,255,0.85) !important;
          font-size: 17px !important;
          margin-bottom: 16px !important;
          max-width: 700px;
        }
        .outing-detail-section-title {
          font-size: 20px !important;
          font-weight: 700 !important;
          margin-bottom: 20px !important;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
        }
        .outing-detail-panel {
          border-radius: 16px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
        }
        .outing-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        .outing-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.08) !important;
        }
        .outing-html-content {
          font-size: 15px;
          line-height: 1.8;
          color: #374151;
        }
        .outing-html-content p { margin-bottom: 14px; }
        .outing-html-content h2, .outing-html-content h3 { color: #1f2937; font-weight: 700; }
        .outing-html-content em { color: #6b7280; }
        .ant-carousel .slick-dots li button {
          background: #2ecc71;
        }
        .ant-carousel .slick-dots li.slick-active button {
          background: #2ecc71;
        }
        .ant-carousel .slick-prev,
        .ant-carousel .slick-next {
          z-index: 10;
          width: 40px !important;
          height: 40px !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
        .ant-carousel .slick-prev:hover,
        .ant-carousel .slick-next:hover {
          background: rgba(0, 0, 0, 0.5) !important;
          color: #2ecc71 !important;
        }
        .ant-carousel .slick-prev {
          left: 15px;
        }
        .ant-carousel .slick-next {
          right: 15px;
        }
        .ant-carousel .slick-prev::before,
        .ant-carousel .slick-next::before,
        .ant-carousel .slick-prev::after,
        .ant-carousel .slick-next::after {
          display: none !important;
          content: none !important;
        }
        .custom-slick-arrow {
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default OutingDetails;
