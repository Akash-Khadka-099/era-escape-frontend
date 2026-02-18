import React, { useState } from "react";
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
import { useGetTrekBlogDetail } from "@/services/trekServices/trekServices";
import ElevationChart from "@/components/Charts/ElevationChart";
import TrekWeather from "./TrekWeather";
import { SEO } from "@/components/SEO";
import TrailLocationDrawer from "../TrailLocationDrawer";
import TrekIntineraryPlans from "../TrekIntineraryPlans";

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
  const { data: trekDetailResponse, isLoading } = useGetTrekBlogDetail(
    slug || "",
  );

  const trekDetail = trekDetailResponse?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!trekDetail) {
    return <div>Trek not found</div>;
  }

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

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
          backgroundImage: `url("${
            trekDetail?.featuredImage?.path
              ? `${baseUrl}/${trekDetail?.featuredImage?.path}`
              : "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          }")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          padding: "60px 0",
          width: "100%",
          margin: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
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
            <div style={{ display: "flex", gap: "12px" }}>
              <Button icon={<FaBookmark />} style={{ borderRadius: "8px" }}>
                Save
              </Button>
              <Button icon={<FaShare />} style={{ borderRadius: "8px" }}>
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
              style={{
                padding: 0,
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
              bodyStyle={{ padding: 0 }}
            >
              <div
                style={{
                  position: "relative",
                  height: "200px",
                  backgroundColor: "#e0e0e0",
                }}
              >
                {/* Map preview image */}
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Map Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "blur(1px)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                  }}
                >
                  <Button
                    type="default"
                    icon={<FaMapMarkedAlt />}
                    style={{
                      fontWeight: "bold",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                    onClick={() => navigate(`/trek-trails/map/${slug}`)}
                  >
                    View Interactive Map
                  </Button>
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
      `}</style>
    </div>
  );
};

export default TrekTrailDetail;
