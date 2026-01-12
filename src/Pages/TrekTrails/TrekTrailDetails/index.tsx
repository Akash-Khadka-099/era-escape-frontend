import React from "react";
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
  FaCloudSun,
  FaWind,
  FaSun,
  FaExclamationTriangle,
  FaShare,
  FaBookmark,
  FaDownload,
  FaWalking,
  FaCalendarAlt,
} from "react-icons/fa";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { trekData } from "../dummyData";
import MiddleContentWrapper from "@/components/ContentWrappers/MiddleContentWrapper";
import { useGetTrekBlogDetail } from "@/services/trekServices/trekServices";
import ElevationChart from "@/components/Charts/ElevationChart";

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
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: trekDetailResponse, isLoading } = useGetTrekBlogDetail(
    slug || ""
  );

  const trekDetail = trekDetailResponse?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!trekDetail) {
    return <div>Trek not found</div>;
  }

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5555";

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          position: "relative",
          height: "500px",
          backgroundImage: `url("${
            trekDetail.featuredImage?.path
              ? `${baseUrl}/${trekDetail.featuredImage.path}`
              : "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          }")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          padding: "40px",
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
              "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            color: "white",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <Tag
              color="#108ee9"
              style={{
                border: "none",
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "4px",
              }}
            >
              {trekDetail.difficulty?.toUpperCase()}
            </Tag>
            <Tag
              color="#555"
              style={{
                border: "none",
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "4px",
              }}
            >
              {trekDetail.country?.toUpperCase()}
            </Tag>
          </div>
          <Title
            level={1}
            style={{ color: "white", margin: "0 0 8px 0", fontSize: "48px" }}
          >
            {trekDetail.title}
          </Title>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Text style={{ color: "#ddd", fontSize: "16px" }}>
              <FaMapMarkedAlt style={{ marginRight: "8px" }} />
              {trekDetail.trekRegion?.name || trekDetail.country}
            </Text>
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
        extraStyles={{ marginTop: "-40px", position: "relative", zIndex: 2 }}
      >
        {/* Stats Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} md={4}>
            <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  color: "#2ecc71",
                  fontSize: "24px",
                  marginBottom: "8px",
                }}
              >
                <FaHiking />
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
              >
                DISTANCE
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                {trekDetail.distanceKm} km
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  color: "#2ecc71",
                  fontSize: "24px",
                  marginBottom: "8px",
                }}
              >
                <FaMountain />
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
              >
                MAX ELEVATION
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                {trekDetail.maxAltitudeMeter} m
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  color: "#2ecc71",
                  fontSize: "24px",
                  marginBottom: "8px",
                }}
              >
                <FaClock />
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
              >
                DURATION
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                {trekDetail.averageDurationDays} Days
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  color: "#2ecc71",
                  fontSize: "24px",
                  marginBottom: "8px",
                }}
              >
                <FaRoute />
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
              >
                DIFFICULTY
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                {trekDetail.difficulty}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  color: "#2ecc71",
                  fontSize: "24px",
                  marginBottom: "8px",
                }}
              >
                <FaCalendarAlt />
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
              >
                BEST SEASON
              </div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                {trekDetail.recommendedSeasons?.join(", ")}
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
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
                  {trekDetail.tags?.map((tag: string) => (
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
              {trekDetail.blogContent?.map((content: any, index: number) => (
                <Card
                  key={index}
                  bordered={false}
                  style={{
                    borderRadius: "12px",
                    marginBottom: "24px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <Title level={3}>{content.title}</Title>

                  {content.images && content.images.length > 0 && (
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
                        arrows={content.images.length >= 2}
                        nextArrow={<NextArrow />}
                        prevArrow={<PrevArrow />}
                      >
                        {content.images.map((img: any, imgIdx: number) => (
                          <div key={imgIdx}>
                            <img
                              src={`${baseUrl}/${img.path}`}
                              alt={`${content.title} ${imgIdx}`}
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
                      __html: content.htmlDescription,
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
                {trekDetail.highlights?.map(
                  (highlight: string, index: number) => (
                    <li key={index}>{highlight}</li>
                  )
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
                    {trekDetail.maxAltitudeMeter}m
                  </strong>
                </Text>
              </div>

              <ElevationChart data={trekDetail.destinations || []} />
            </Card>

            {/* FAQs Section */}
            {trekDetail.faqs && trekDetail.faqs.length > 0 && (
              <Card
                bordered={false}
                style={{
                  borderRadius: "12px",
                  marginBottom: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <Title level={3}>Frequently Asked Questions</Title>
                <Collapse ghost expandIconPosition="end">
                  {trekDetail.faqs.map((faq: any, index: number) => (
                    <Panel
                      header={<Text strong>{faq.question}</Text>}
                      key={index}
                    >
                      <Paragraph>{faq.answer}</Paragraph>
                    </Panel>
                  ))}
                </Collapse>
              </Card>
            )}
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
                    onClick={() => navigate("/trek-trails/map")}
                  >
                    View Interactive Map
                  </Button>
                </div>
              </div>
              <div style={{ padding: "20px" }}>
                <Title level={4} style={{ marginTop: 0 }}>
                  Trail Actions
                </Title>
                <Button
                  type="primary"
                  block
                  icon={<FaWalking />}
                  size="large"
                  style={{
                    marginBottom: "12px",
                    backgroundColor: "#2ecc71",
                    borderColor: "#2ecc71",
                    height: "48px",
                    fontSize: "16px",
                  }}
                >
                  Start Navigation
                </Button>
                <Button
                  block
                  icon={<FaDownload />}
                  size="large"
                  style={{ height: "48px", fontSize: "16px" }}
                >
                  Download GPX
                </Button>
              </div>
            </Card>

            {/* Current Conditions */}
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
                  marginBottom: "16px",
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Current Conditions
                </Title>
                <Tag color="green">Live</Tag>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FaCloudSun
                  style={{
                    fontSize: "48px",
                    color: "#f39c12",
                    marginRight: "16px",
                  }}
                />
                <div>
                  <div style={{ fontSize: "32px", fontWeight: "bold" }}>
                    {trekData.conditions.temp}
                  </div>
                  <div style={{ color: "#666" }}>
                    {trekData.conditions.weather}
                  </div>
                </div>
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ fontSize: "12px", color: "#888" }}>Wind</div>
                  <div style={{ fontWeight: "bold" }}>
                    <FaWind style={{ marginRight: "6px" }} />{" "}
                    {trekData.conditions.wind}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: "12px", color: "#888" }}>Sunset</div>
                  <div style={{ fontWeight: "bold" }}>
                    <FaSun style={{ marginRight: "6px" }} />{" "}
                    {trekData.conditions.sunset}
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Bear Activity Warning */}
            <Card
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
            </Card>
          </Col>
        </Row>
      </MiddleContentWrapper>

      <style>{`
        .blog-html-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
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
      `}</style>
    </div>
  );
};

export default TrekTrailDetail;
