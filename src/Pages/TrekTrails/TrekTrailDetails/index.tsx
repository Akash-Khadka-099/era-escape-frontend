import React, { useState, useEffect } from "react";
import {
  Button,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Divider,
  Carousel,
  Collapse,
  Space,
  Flex,
  message,
} from "antd";
import {
  FaHiking,
  FaMountain,
  FaClock,
  FaRoute,
  FaMapMarkedAlt,
  FaShare,
  FaBookmark,
  FaCalendarAlt,
} from "react-icons/fa";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import {
  useCreateSavedTrekBlog,
  useDeleteSavedTrekBlog,
  useFetchSavedTrekBlogs,
  useGetTrekBlogDetail,
} from "@/services/trekServices/trekServices";
import ElevationChart from "@/components/Charts/ElevationChart";
import TrekWeather from "./TrekWeather";
import { SEO } from "@/components/SEO";
import TrailLocationDrawer from "../TrailLocationDrawer";
import TrekIntineraryPlans from "../TrekIntineraryPlans";
import SuspensePageLoader from "@/components/Loaders/SuspensePageLoader";
import useAuthStore from "@/store/authStore";
import useAuthModalStore from "@/store/authModalStore";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

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

const TrekTrailDetail: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const { slug } = useParams();
  const { isAuthenticated } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();

  const { data: trekDetailResponse, isLoading } = useGetTrekBlogDetail(
    slug || "",
  );
  const { mutateAsync: createSavedTrekBlog, isPending: isCreatingSavedTrekBlog } =
    useCreateSavedTrekBlog();
  const { mutateAsync: deleteSavedTrekBlog, isPending: isDeletingSavedTrekBlog } =
    useDeleteSavedTrekBlog();

  const trekDetail = trekDetailResponse?.data;
  const { data: savedTrekBlogsResponse, isLoading: isSavedTrekBlogsLoading } =
    useFetchSavedTrekBlogs(
      { page: 1, pageSize: 100 },
      Boolean(isAuthenticated && trekDetail?._id),
    );

  const savedTrekBlogEntry = savedTrekBlogsResponse?.data?.find((item: any) => {
    const savedTrekBlogId = item?.trekBlogId?._id || item?.trekBlogId;
    return savedTrekBlogId === trekDetail?._id;
  });

  const savedTrekBlogEntryId = savedTrekBlogEntry?._id || savedTrekBlogEntry?.id;
  const isSaved = Boolean(savedTrekBlogEntryId);
  const isSaveActionLoading =
    isCreatingSavedTrekBlog || isDeletingSavedTrekBlog || isSavedTrekBlogsLoading;

  // Preload Map Component in background
  useEffect(() => {
    // This starts downloading the large Cesium assets while the user is
    // reading the trek details, ensuring navigation is instant later.
    const preloadMap = () => import("@/Pages/TrekTrails/TrekTrailMap");
    preloadMap();
  }, []);

  if (isLoading) {
    return <SuspensePageLoader />;
  }

  if (!trekDetail) {
    return <div>Trek not found</div>;
  }

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";
  const destinationCount = trekDetail?.destinations?.length || 0;

  const handleOpenTrailMap = () => {
    if (!slug) return;
    navigate(`/trek-trails/map/${slug}`);
  };

  const handleMapCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenTrailMap();
    }
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
    textArea.style.pointerEvents = "none";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const copied = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (!copied) {
      throw new Error("Unable to copy link");
    }
  };

  const handleToggleSave = async () => {
    if (!trekDetail?._id) {
      message.error("Unable to identify this trek blog");
      return;
    }

    if (!isAuthenticated) {
      openAuthModal();
      message.warning("Please login to save trek blogs.");
      return;
    }

    try {
      if (isSaved && savedTrekBlogEntryId) {
        const response = await deleteSavedTrekBlog(savedTrekBlogEntryId);
        message.success(response?.data?.message || "Trek blog removed from saved list");
        return;
      }

      const response = await createSavedTrekBlog({ trekBlogId: trekDetail._id });
      message.success(response?.data?.message || "Trek blog saved successfully");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Unable to update saved trek blog status";
      message.error(errorMessage);
    }
  };

  const handleShareTrekBlog = async () => {
    try {
      await copyTextToClipboard(window.location.href);
      message.success("Link copied to clipboard");
    } catch {
      message.error("Unable to copy link right now");
    }
  };

  // --- Advanced SEO Logic ---
  const regionName = Array.isArray(trekDetail?.trekRegion)
    ? trekDetail.trekRegion[0]?.name
    : trekDetail?.trekRegion?.name || "Nepal";

  // 1. Keyword-Rich Title
  // Format: {Title} Trek | {Difficulty} Hike in {Region} ({Days} Days) | Era Escape
  // Example: Nagthali Trek | Medium Hike in Langtang (2 Days) | Era Escape
  const seoTitle = `${trekDetail?.title} Trek | ${trekDetail?.difficulty} Hike in ${regionName} (${trekDetail?.averageDurationDays} Days)`;

  // 2. Compelling Meta Description
  // Combine short notes, highlights, and a call to action.
  const highlightsText = trekDetail?.highlights?.slice(0, 3).join(". ") || "";
  const seoDescription =
    `${trekDetail?.shortNotes || "Experience the Himalayas."} ${highlightsText}. Book your ${trekDetail?.averageDurationDays}-day ${trekDetail?.title} adventure today in ${regionName}. Perfect for ${trekDetail?.difficulty} level trekkers.`
      .substring(0, 300)
      .trim();

  // 3. Strategic Keywords
  const keywords = [
    trekDetail?.title,
    `${trekDetail?.title} Trek`,
    `${trekDetail?.title} Trekking`,
    `Trekking in ${regionName}`,
    "Nepal Trekking Packages",
    "Himalayan Treks",
    "Best Treks in Nepal",
    "Tour and Travels Nepal",
    `${trekDetail?.difficulty} Treks Nepal`,
    ...(trekDetail?.tags || []),
    ...(trekDetail?.categories?.map((c: any) => c.title) || []),
    ...(Array.isArray(trekDetail?.trekRegion)
      ? trekDetail.trekRegion.map((r: any) => r.name)
      : [trekDetail?.trekRegion?.name]),
  ].filter(Boolean) as string[];

  // 4. Rich Structured Data (Schemas)

  // Product Schema (for booking/packages)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${trekDetail?.title} Trek`,
    description: trekDetail?.shortNotes,
    image: trekDetail?.featuredImage?.path
      ? `${baseUrl}/${trekDetail?.featuredImage?.path}`
      : undefined,
    brand: {
      "@type": "Brand",
      name: "Era Escape",
    },
    offers: {
      "@type": "Offer",
      url: window.location.href,
      priceCurrency: "USD",
      price: "100", // Ideally dynamic
      availability: "https://schema.org/InStock",
      priceValidUntil: "2025-12-31",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "124",
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
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
        name: "Trek Trails",
        item: `${window.location.origin}/trek-trails`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: trekDetail?.title,
        item: window.location.href,
      },
    ],
  };

  // FAQ Schema
  const faqSchema =
    trekDetail?.faqs && trekDetail?.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: trekDetail.faqs.map((faq: any) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  // Image Object Schema (for Featured Image)
  const imageSchema = trekDetail?.featuredImage?.path
    ? {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        contentUrl: `${baseUrl}/${trekDetail?.featuredImage?.path}`,
        license: "https://eraescape.com/license",
        acquireLicensePage: "https://eraescape.com/contact",
        creditText: "Era Escape",
        creator: {
          "@type": "Organization",
          name: "Era Escape",
        },
        copyrightNotice: "Era Escape",
      }
    : null;

  const schemas = [
    productSchema,
    breadcrumbSchema,
    faqSchema,
    imageSchema,
  ].filter(Boolean);

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        paddingBottom: "40px",
        width: "100%",
        margin: 0,
        padding: 0,
      }}
    >
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={keywords}
        canonical={`${window.location.origin}/trek-trails/detail/${trekDetail?.slug}`}
        schema={schemas}
        ogImage={
          trekDetail?.featuredImage?.path
            ? `${baseUrl}/${trekDetail?.featuredImage?.path}`
            : undefined
        }
        openGraphType="product"
      />
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          height: "70vh",
          minHeight: "600px",
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          padding: "60px 0",
          width: "100%",
          margin: 0,
          overflow: "hidden",
        }}
      >
        <img
          src={
            trekDetail?.featuredImage?.path
              ? `${baseUrl}/${trekDetail?.featuredImage?.path}`
              : "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          }
          alt={`${trekDetail?.title} - Era Escape`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "1500px",
            margin: "0 auto",
            color: "white",
            animation: "fadeInUp 0.8s ease-out forwards",
            padding: "0 40px", // Added padding to keep text away from edges
          }}
        >
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {trekDetail?.country && (
              <Tag
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  borderRadius: "30px",
                  margin: 0,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {trekDetail.country}
              </Tag>
            )}
            {trekDetail?.categories?.map((category: any) => (
              <Tag
                key={category?._id}
                style={{
                  background: "rgba(255, 193, 7, 0.25)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 193, 7, 0.4)",
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  borderRadius: "30px",
                  margin: 0,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {category?.title}
              </Tag>
            ))}
          </div>
          <Title
            level={1}
            className="hero-title"
            style={{
              color: "white",
              margin: "0 0 16px 0",
              fontWeight: 800,
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            {trekDetail?.title}
          </Title>
          <div
            className="hero-actions"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <FaMapMarkedAlt style={{ color: "#2ecc71", fontSize: "20px" }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {Array.isArray(trekDetail?.trekRegion) ? (
                  trekDetail.trekRegion.map((region: any, idx: number) => (
                    <Text
                      key={region?._id}
                      style={{
                        color: "#eee",
                        fontSize: "18px",
                        fontWeight: 500,
                      }}
                    >
                      {region?.name}
                      {idx < trekDetail.trekRegion.length - 1 ? " • " : ""}
                    </Text>
                  ))
                ) : (
                  <Text
                    style={{ color: "#eee", fontSize: "18px", fontWeight: 500 }}
                  >
                    {trekDetail?.trekRegion?.name || trekDetail?.country}
                  </Text>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <Button
                icon={
                  <FaBookmark color={isSaved ? "#fde68a" : "#f8fafc"} style={{ fontSize: "14px" }} />
                }
                style={{
                  height: "42px",
                  borderRadius: "12px",
                  border: isSaved
                    ? "1px solid rgba(253, 230, 138, 0.45)"
                    : "1px solid rgba(255, 255, 255, 0.22)",
                  background: isSaved
                    ? "linear-gradient(140deg, rgba(68, 92, 66, 0.82), rgba(48, 76, 52, 0.74))"
                    : "linear-gradient(140deg, rgba(64, 85, 66, 0.78), rgba(44, 63, 49, 0.72))",
                  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  color: "#f8fafc",
                  fontWeight: 700,
                  fontSize: "14px",
                  padding: "0 12px",
                  minWidth: "160px",
                }}
                onClick={handleToggleSave}
                loading={isSaveActionLoading}
              >
                {isSaved ? "Saved Expedition" : "Save Expedition"}
              </Button>
              <Button
                icon={<FaShare style={{ fontSize: "14px", color: "#f8fafc" }} />}
                onClick={handleShareTrekBlog}
                style={{
                  height: "42px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.22)",
                  background:
                    "linear-gradient(140deg, rgba(64, 85, 66, 0.78), rgba(44, 63, 49, 0.72))",
                  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  color: "#f8fafc",
                  fontWeight: 700,
                  fontSize: "14px",
                  padding: "0 12px",
                  minWidth: "100px",
                }}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MiddleContentWrapper
        extraStyles={{
          marginTop: "-40px",
          position: "relative",
          zIndex: 2,
          maxWidth: "1500px",
        }}
      >
        {/* Stats Cards */}
        <div className="stats-grid" style={{ margin: "20px 0px 40px 0px" }}>
          {[
            {
              icon: <FaHiking />,
              label: "DISTANCE",
              value: `${trekDetail?.distanceKm} km`,
            },
            {
              icon: <FaMountain />,
              label: "MAX ELEVATION",
              value: `${trekDetail?.maxAltitudeMeter} m`,
            },
            {
              icon: <FaClock />,
              label: "DURATION",
              value: `${trekDetail?.averageDurationDays} Days`,
            },
            {
              icon: <FaRoute />,
              label: "DIFFICULTY",
              value: trekDetail?.difficulty,
            },
            {
              icon: <FaCalendarAlt />,
              label: "BEST SEASON",
              value: trekDetail?.recommendedSeasons?.join(", "),
            },
          ].map((stat, i) => (
            <div key={i}>
              <Card
                bordered={false}
                className="stat-card"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  height: "100%",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    color: "#2ecc71",
                    fontSize: "24px",
                    marginBottom: "12px",
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#A0AEC0",
                    fontWeight: "700",
                    letterSpacing: "1.2px",
                    marginBottom: "4px",
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#2D3748",
                  }}
                >
                  {stat.value}
                </div>
              </Card>
            </div>
          ))}
        </div>

        <Row gutter={[24, 24]} style={{ marginBottom: "40px" }}>
          {/* Main Content Column */}
          <Col xs={24} lg={16}>
            {/* About Section */}
            <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                marginBottom: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              {/* Tags Section */}
              <div style={{ marginBottom: "24px" }}>
                <Space wrap>
                  {trekDetail?.tags?.map((tag: string) => (
                    <Tag
                      key={tag}
                      style={{
                        padding: "6px 16px",
                        borderRadius: "20px",
                        background: "#fff",
                        border: "1px solid #e8e8e8",
                        fontSize: "14px",
                        margin: "0",
                      }}
                    >
                      #{tag}
                    </Tag>
                  ))}
                </Space>
              </div>

              {/* Blog Content Section */}
              {trekDetail?.blogContent?.map((content: any, index: number) => (
                <Card
                  key={index}
                  bordered={false}
                  styles={{
                    body: { padding: 0 },
                    header: { padding: 0 },
                  }}
                  style={{
                    borderRadius: "12px",
                    marginBottom: "24px",
                    boxShadow: "none",
                    padding: 0,
                  }}
                >
                  <Title level={3}>{content?.title}</Title>

                  {content?.images && content?.images?.length > 0 && (
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
                        arrows={content?.images?.length >= 2}
                        nextArrow={<NextArrow />}
                        prevArrow={<PrevArrow />}
                      >
                        {content?.images?.map((img: any, imgIdx: number) => (
                          <div key={imgIdx}>
                            <img
                              src={`${baseUrl}/${img?.path}`}
                              alt={`${content?.title} ${imgIdx}`}
                              loading="lazy"
                              style={{
                                width: "100%",
                                height: "400px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </div>
                  )}

                  <div
                    className="blog-html-content"
                    dangerouslySetInnerHTML={{
                      __html: content?.htmlDescription,
                    }}
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.8",
                      color: "#444",
                    }}
                  />
                </Card>
              ))}

              <Divider />

              <Title level={4}>Highlights</Title>
              <ul
                style={{
                  paddingLeft: "20px",
                  fontSize: "16px",
                  lineHeight: "1.8",
                  color: "#444",
                }}
              >
                {trekDetail?.highlights?.map(
                  (highlight: string, index: number) => (
                    <li key={index}>{highlight}</li>
                  ),
                )}
              </ul>
            </Card>

            {/* Elevation Profile */}
            <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                marginBottom: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <Title level={3} style={{ margin: 0 }}>
                  Elevation Profile
                </Title>
                <Text type="secondary">
                  Max Elevation:{" "}
                  <strong style={{ color: "#000" }}>
                    {trekDetail?.maxAltitudeMeter}m
                  </strong>
                </Text>
              </div>

              <ElevationChart data={trekDetail?.destinations || []} />
            </Card>
          </Col>

          {/* Sidebar Column */}
          <Col xs={24} lg={8}>
            {/* Map Preview Card */}
            <Card
              bordered={false}
              hoverable
              className="map-preview-card"
              style={{
                padding: 0,
                borderRadius: "20px",
                overflow: "hidden",
                marginBottom: "24px",
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
              }}
              bodyStyle={{ padding: 0 }}
            >
              <div
                className="map-preview-surface"
                role="button"
                tabIndex={0}
                aria-label={`Open interactive trail map for ${trekDetail?.title}`}
                onClick={handleOpenTrailMap}
                onKeyDown={handleMapCardKeyDown}
              >
                <img
                  src="/images/mapTrailImage.png"
                  alt="Map Preview"
                  className="map-preview-image"
                />
                <div className="map-preview-overlay" />
                <div className="map-preview-content">
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <Tag
                      style={{
                        margin: 0,
                        border: "none",
                        borderRadius: "999px",
                        padding: "6px 12px",
                        background: "rgba(255, 255, 255, 0.18)",
                        color: "#fff",
                        fontWeight: 700,
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      Interactive Route
                    </Tag>
                    {destinationCount > 0 && (
                      <Tag
                        style={{
                          margin: 0,
                          border: "none",
                          borderRadius: "999px",
                          padding: "6px 12px",
                          background: "rgba(34, 197, 94, 0.18)",
                          color: "#f0fdf4",
                          fontWeight: 700,
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        {destinationCount} Trail Stops
                      </Tag>
                    )}
                  </div>

                  <div>
                    <Title
                      level={4}
                      style={{
                        color: "#fff",
                        margin: "0 0 10px 0",
                        fontSize: "28px",
                        lineHeight: 1.2,
                      }}
                    >
                      View Interactive Map & Trail Sections
                    </Title>
                    <Paragraph
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        margin: 0,
                        fontSize: "15px",
                        lineHeight: 1.7,
                        maxWidth: "420px",
                      }}
                    >
                      Follow the route, inspect key trail stops, and jump into
                      the full map experience for this trek.
                    </Paragraph>
                  </div>

                  <Flex justify="center">
                    <div className="">
                      <Button
                        type="primary"
                        size="large"
                        icon={<FaMapMarkedAlt />}
                        className="map-preview-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOpenTrailMap();
                        }}
                      >
                        Explore Trail Map
                      </Button>
                    </div>
                  </Flex>
                </div>
              </div>
            </Card>

            {/* Weather Section */}
            {trekDetail?.weatherConditions && (
              <TrekWeather
                weather={{
                  weatherData: trekDetail.weatherConditions.weatherData,
                  source: trekDetail.weatherConditions.source,
                  updatedAt: trekDetail.weatherConditions.updatedAt,
                }}
                locationName={trekDetail.title}
              />
            )}

            {/* Bear Activity Warning */}
            {/* <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                backgroundColor: "#fff7e6",
                border: "1px solid #ffe58f",
              }}
            >
              <div style={{ display: "flex", gap: "12px" }}>
                <FaExclamationTriangle
                  style={{
                    color: "#faad14",
                    fontSize: "24px",
                    marginTop: "4px",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#d46b08",
                      marginBottom: "4px",
                    }}
                  >
                    Bear Activity
                  </div>
                  <div style={{ fontSize: "13px", color: "#d46b08" }}>
                    Recent bear sightings near the Panorama Point. Carry bear
                    spray and hike in groups.
                  </div>
                </div>
              </div>
            </Card> */}
          </Col>
        </Row>

        {/* Full Width Itinerary & FAQs Section */}
        <div style={{ marginTop: "40px" }}>
          <TrekIntineraryPlans />

          {trekDetail?.faqs && trekDetail?.faqs?.length > 0 && (
            <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                marginBottom: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                marginTop: "40px",
              }}
            >
              <Title level={3} style={{ marginBottom: "24px" }}>
                Frequently Asked Questions
              </Title>
              <Collapse ghost accordion expandIconPosition="end">
                {trekDetail?.faqs?.map((faq: any, index: number) => (
                  <Panel
                    header={
                      <Text
                        strong
                        style={{ fontSize: "16px", color: "#1a1a1a" }}
                      >
                        {faq?.question}
                      </Text>
                    }
                    key={index}
                    style={{
                      marginBottom: "8px",
                      background: "transparent",
                      borderRadius: "12px",
                      border: "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div style={{ padding: "0 20px 20px 20px" }}>
                      <Paragraph
                        style={{
                          color: "#596780",
                          fontSize: "15px",
                          lineHeight: "1.7",
                          margin: 0,
                        }}
                      >
                        {faq?.answer}
                      </Paragraph>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </Card>
          )}
        </div>

        <TrailLocationDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </MiddleContentWrapper>
      <style>{`
        .blog-html-content {
          color: #4a5568;
          font-size: 16px;
          line-height: 1.8;
        }
        .blog-html-content h1, .blog-html-content h2, .blog-html-content h3 {
          color: #2d3748;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .blog-html-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 24px 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .blog-html-content figure {
          margin: 0;
        }
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
        .hero-section {
          width: 100% !important;
          max-width: 100vw !important;
          position: relative !important;
          margin: 0 !important;
          left: 0 !important;
          right: 0 !important;
        }
        .hero-title {
          font-size: 64px !important;
          line-height: 1.1 !important;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 40px !important;
          }
          .hero-section {
            height: auto !important;
            min-height: 500px !important;
            padding: 140px 0 60px 0 !important;
          }
          .hero-actions {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 20px;
          }
        }
        @media (max-width: 575px) {
          .stats-col-padding-xs {
            padding: 0 !important;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .ant-collapse-item {
          transition: all 0.3s ease !important;
        }
        .ant-collapse-item-active {
          background: #fff !important;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06) !important;
        }
        .ant-collapse-header {
          padding: 18px 20px !important;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
        }
        .map-preview-card {
          border: none;
        }
        .map-preview-card .ant-card-body {
          padding: 0 !important;
        }
        .map-preview-surface {
          position: relative;
          min-height: 280px;
          display: flex;
          align-items: stretch;
          cursor: pointer;
          outline: none;
          background: linear-gradient(135deg, #052e2b 0%, #0f766e 100%);
        }
        .map-preview-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(0.5px) saturate(0.95);
          transform: scale(1);
          transition: transform 0.45s ease, filter 0.45s ease;
        }
        .map-preview-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(5, 46, 43, 0.2) 0%, rgba(5, 46, 43, 0.88) 100%);
          transition: background 0.3s ease;
        }
        .map-preview-content {
          position: relative;
          z-index: 1;
          min-height: 280px;
          width: 100%;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
        }
        .map-preview-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .map-preview-button {
          height: 48px;
          padding-inline: 18px;
          border: none;
          border-radius: 999px;
          font-weight: 700;
          background: linear-gradient(135deg, #14b8a6 0%, #22c55e 100%) !important;
          box-shadow: 0 10px 24px rgba(20, 184, 166, 0.28);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .map-preview-hint {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px 10px 16px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          transition: transform 0.25s ease, background 0.25s ease;
        }
        .map-preview-arrow {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.18);
          color: #fff;
        }
        .map-preview-surface:hover .map-preview-image,
        .map-preview-surface:focus-visible .map-preview-image {
          transform: scale(1.06);
          filter: blur(0) saturate(1.05);
        }
        .map-preview-surface:hover .map-preview-overlay,
        .map-preview-surface:focus-visible .map-preview-overlay {
          background:
            linear-gradient(180deg, rgba(5, 46, 43, 0.12) 0%, rgba(5, 46, 43, 0.94) 100%);
        }
        .map-preview-surface:hover .map-preview-button,
        .map-preview-surface:focus-visible .map-preview-button {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(20, 184, 166, 0.34);
        }
        .map-preview-surface:hover .map-preview-hint,
        .map-preview-surface:focus-visible .map-preview-hint {
          transform: translateX(4px);
          background: rgba(255, 255, 255, 0.18);
        }
        .map-preview-surface:focus-visible {
          box-shadow: inset 0 0 0 3px rgba(94, 234, 212, 0.8);
        }
        @media (max-width: 575px) {
          .map-preview-surface,
          .map-preview-content {
            min-height: 240px;
          }
          .map-preview-content h4 {
            font-size: 24px !important;
          }
          .map-preview-actions {
            align-items: stretch;
          }
          .map-preview-button,
          .map-preview-hint {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default TrekTrailDetail;
