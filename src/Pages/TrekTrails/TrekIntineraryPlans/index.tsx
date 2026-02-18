import React from "react";
import { useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { useFetchTrekBlogItineraryPlans } from "@/services/trekServices/trekServices";
import {
  Card,
  Tag,
  Typography,
  Empty,
  Skeleton,
  Row,
  Col,
  Divider,
  Collapse,
} from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  DownOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const TrekIntineraryPlans: React.FC<{ hideSEO?: boolean }> = ({
  hideSEO = false,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const { data: itineraryPlans, isLoading } = useFetchTrekBlogItineraryPlans({
    trekBlogSlug: slug || "",
  });

  if (isLoading) {
    return (
      <div style={{ padding: "40px 0" }}>
        <Skeleton active avatar paragraph={{ rows: 4 }} />
        <Divider />
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (!itineraryPlans || itineraryPlans.length === 0) {
    return (
      <Card
        style={{
          borderRadius: "24px",
          border: "2px dashed #e8e8e8",
          textAlign: "center",
          padding: "60px 0",
          marginTop: "30px",
          background: "#fafafa",
        }}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary" style={{ fontSize: "16px" }}>
              No itinerary plans found for this trek yet.
            </Text>
          }
        />
      </Card>
    );
  }

  // --- SEO Logic for Itineraries ---
  const trekName = itineraryPlans[0]?.trekBlogId?.title || "Trek";
  const regionName =
    itineraryPlans[0]?.trekBlogId?.trekRegion?.[0]?.name || "Nepal";

  const seoTitle = `${trekName} Trek Itinerary & Cost | ${itineraryPlans.length} Options | Era Escape`;
  const seoDescription = `Compare best ${trekName} trek itineraries. ${itineraryPlans
    .map((p: any) => `${p.estimatedDays} Days (${p.difficultyLevel})`)
    .join(", ")}. Prices from Rs. ${Math.min(
    ...itineraryPlans.map((p: any) => p.estimatedMinCost || 0),
  )} to Rs. ${Math.max(
    ...itineraryPlans.map((p: any) => p.estimatedMaxCost || 0),
  )}.`;

  const keywords = [
    `${trekName} Itinerary`,
    `${trekName} Trek Cost`,
    `${trekName} Trek Map`,
    `Trekking in ${regionName}`,
    "Nepal Trekking Packages",
    ...itineraryPlans.map(
      (p: any) => `${p.estimatedDays} Days ${trekName} Trek`,
    ),
  ];

  // Product Schemas for each Itinerary Option
  const productSchemas = itineraryPlans.map((plan: any) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${trekName} Trek - ${plan.estimatedDays} Days Option`,
    description: `A ${plan.difficultyLevel} difficulty trek in ${regionName}. Estimate cost: ${plan.estimatedMinCost} - ${plan.estimatedMaxCost}.`,
    offers: {
      "@type": "Offer",
      price: plan.estimatedMinCost,
      priceCurrency: "NPR", // Assuming NPR based on 'Rs'
      availability: "https://schema.org/InStock",
      url: window.location.href,
    },
    brand: {
      "@type": "Brand",
      name: "Era Escape",
    },
  }));

  return (
    <>
      {!hideSEO && (
        <SEO
          title={seoTitle}
          description={seoDescription}
          keywords={keywords}
          schema={productSchemas}
          openGraphType="product"
        />
      )}
      <Card
        bordered={false}
        style={{
          borderRadius: "12px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "left", marginBottom: "32px" }}>
          <Title level={2} style={{ marginBottom: "12px", fontWeight: 700 }}>
            <EnvironmentOutlined
              style={{ color: "#1890ff", marginRight: "12px" }}
            />
            Tailored Trekking Itineraries
          </Title>
          <Text
            type="secondary"
            style={{
              fontSize: "16px",
              display: "block",
            }}
          >
            Choose the perfect plan that fits your pace, budget, and adventure
            style. Each plan is carefully crafted for an optimal experience.
          </Text>
        </div>

        <Collapse
          accordion
          ghost
          expandIcon={({ isActive }) => (
            <DownOutlined
              rotate={isActive ? 180 : 0}
              style={{ fontSize: "18px", color: "#1890ff" }}
            />
          )}
          expandIconPosition="end"
          style={{ background: "transparent" }}
        >
          {itineraryPlans.map((plan: any, index: number) => (
            <Panel
              key={plan._id || index}
              header={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "20px",
                    width: "100%",
                    paddingRight: "20px",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          background: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#1890ff",
                          boxShadow: "0 4px 10px rgba(24, 144, 255, 0.15)",
                        }}
                      >
                        <ClockCircleOutlined style={{ fontSize: "20px" }} />
                      </div>
                      <div>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: "12px",
                            display: "block",
                            fontWeight: 500,
                          }}
                        >
                          DURATION
                        </Text>
                        <Text
                          strong
                          style={{ fontSize: "18px", color: "#262626" }}
                        >
                          {plan.estimatedDays} Days
                        </Text>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          background: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#52c41a",
                          boxShadow: "0 4px 10px rgba(82, 196, 26, 0.15)",
                        }}
                      >
                        <DollarOutlined style={{ fontSize: "20px" }} />
                      </div>
                      <div>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: "12px",
                            display: "block",
                            fontWeight: 500,
                          }}
                        >
                          EST. BUDGET
                        </Text>
                        <Text
                          strong
                          style={{ fontSize: "18px", color: "#262626" }}
                        >
                          Rs. {plan.estimatedMinCost?.toLocaleString()} -{" "}
                          {plan.estimatedMaxCost?.toLocaleString()}
                        </Text>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Tag
                      color={
                        plan.difficultyLevel === "Hard"
                          ? "volcano"
                          : plan.difficultyLevel === "Medium"
                            ? "orange"
                            : "green"
                      }
                      style={{
                        padding: "4px 16px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontWeight: 700,
                        margin: 0,
                        border: "none",
                        textTransform: "uppercase",
                      }}
                    >
                      {plan.difficultyLevel}
                    </Tag>
                  </div>
                </div>
              }
              style={{
                marginBottom: "24px",
                background: "#fff",
                borderRadius: "24px",
                border: "1px solid #f0f0f0",
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ padding: "10px 32px 32px 32px" }}>
                <Divider style={{ margin: "0 0 32px 0" }} />
                <Row gutter={[48, 32]}>
                  <Col xs={24} lg={14}>
                    <div style={{ marginBottom: "16px" }}>
                      <Title
                        level={4}
                        style={{
                          marginBottom: "24px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          color: "#1a1a1a",
                        }}
                      >
                        <ThunderboltOutlined style={{ color: "#faad14" }} />
                        Itinerary Highlights & Route
                      </Title>
                      <div
                        className="itinerary-description custom-scrollbar"
                        style={{
                          fontSize: "16px",
                          lineHeight: "1.9",
                          color: "#4a4a4a",
                          maxHeight: "400px",
                          overflowY: "auto",
                          paddingRight: "15px",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: plan.htmlDescription,
                        }}
                      />
                    </div>
                  </Col>

                  <Col xs={24} lg={10}>
                    <div
                      style={{
                        background: "#f8fafc",
                        padding: "32px",
                        borderRadius: "24px",
                        height: "100%",
                        border: "1px solid #edf2f7",
                      }}
                    >
                      <Title
                        level={5}
                        style={{
                          marginBottom: "24px",
                          color: "#1a1a1a",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <InfoCircleOutlined style={{ color: "#1890ff" }} />
                        Pro Tips & Notes
                      </Title>
                      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                        {plan.notes?.map((note: string, i: number) => (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              gap: "14px",
                              marginBottom: "20px",
                              alignItems: "flex-start",
                            }}
                          >
                            <div style={{ marginTop: "4px" }}>
                              <CheckCircleOutlined
                                style={{ color: "#52c41a", fontSize: "18px" }}
                              />
                            </div>
                            <Text
                              style={{
                                fontSize: "15px",
                                color: "#595959",
                                lineHeight: "1.6",
                              }}
                            >
                              {note}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
            </Panel>
          ))}
        </Collapse>

        <style>
          {`
          .ant-collapse-header {
            padding: 24px 32px !important;
            align-items: center !important;
          }
          .ant-collapse-content-box {
            padding: 0 !important;
          }
          .itinerary-description h3 {
            font-size: 20px;
            margin-bottom: 18px;
            color: #1a1a1a;
            font-weight: 700;
            display: block;
            margin-top: 24px;
          }
          .itinerary-description h3:first-child {
            margin-top: 0;
          }
          .itinerary-description p {
            margin-bottom: 16px;
          }
          .itinerary-description ul {
            padding-left: 0;
            margin-bottom: 24px;
            list-style: none;
          }
          .itinerary-description li {
            margin-bottom: 12px;
            position: relative;
            padding-left: 24px;
          }
          .itinerary-description li::before {
            content: "•";
            color: #1890ff;
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
            position: absolute;
            left: 20px;
            font-size: 20px;
            line-height: 1;
          }
          .itinerary-description strong {
            color: #1890ff;
            font-weight: 600;
          }
          
          /* Custom Scrollbar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d9d9d9;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #bfbfbf;
          }
        `}
        </style>
      </Card>
    </>
  );
};

export default TrekIntineraryPlans;
