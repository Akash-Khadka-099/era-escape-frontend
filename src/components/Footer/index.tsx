import React from "react";
import { Layout, Row, Col, Typography, Flex } from "antd";
import {
  MailOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  GlobalOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { routeLists } from "@/Routes/routeLists";

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const CustomFooter: React.FC = () => {
  return (
    <Footer
      style={{
        background: "#F8F9FA",
        padding: "80px 40px 40px",
        borderTop: "1px solid #EEE",
      }}
    >
      <Row gutter={[40, 40]} justify="space-between">
        {/* Brand Section */}
        <Col xs={24} lg={6}>
          <div style={{ marginBottom: "24px" }}>
            <Title
              level={4}
              style={{
                color: "#2D5A5A",
                fontWeight: 800,
                margin: 0,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Era Escape
            </Title>
          </div>
          <Text
            style={{
              color: "#666",
              lineHeight: 1.6,
              display: "block",
              marginBottom: "24px",
            }}
          >
            Curating the world's most breathtaking paths for the conscious
            wanderer. More than just a blog - a trailhead for your next
            off-script.
          </Text>
          <Flex gap={16}>
            <GlobalOutlined
              style={{ fontSize: "20px", color: "#666", cursor: "pointer" }}
            />
            <ShareAltOutlined
              style={{ fontSize: "20px", color: "#666", cursor: "pointer" }}
            />
            <MailOutlined
              style={{ fontSize: "20px", color: "#666", cursor: "pointer" }}
            />
          </Flex>
        </Col>

        {/* Explore Section */}
        <Col xs={12} sm={8} lg={4}>
          <Title
            level={5}
            style={{
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "24px",
            }}
          >
            Explore
          </Title>
          <Flex vertical gap={12}>
            <Link href={routeLists.trekTrails} style={{ color: "#666" }}>
              All Treks
            </Link>
            <Link href={routeLists.exploreHikes} style={{ color: "#666" }}>
              Explore Hikes
            </Link>
            <Link href="#!" style={{ color: "#666" }}>
              Mountain Guides
            </Link>
            <Link href="#!" style={{ color: "#666" }}>
              Expedition Gear
            </Link>
            <Link href="#!" style={{ color: "#666" }}>
              Regional Map
            </Link>
          </Flex>
        </Col>

        {/* Difficulty Section */}
        <Col xs={12} sm={8} lg={4}>
          <Title
            level={5}
            style={{
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "24px",
            }}
          >
            Difficulty
          </Title>
          <Flex vertical gap={12}>
            <Link href="#!" style={{ color: "#666" }}>
              Novice Routes
            </Link>
            <Link href="#!" style={{ color: "#666" }}>
              Technical Peaks
            </Link>
            <Link href="#!" style={{ color: "#666" }}>
              Multi-day Treks
            </Link>
            <Link href="#!" style={{ color: "#666" }}>
              Family Adventures
            </Link>
          </Flex>
        </Col>

        {/* Contact Section */}
        <Col xs={24} sm={8} lg={6}>
          <Title
            level={5}
            style={{
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "24px",
            }}
          >
            Contact
          </Title>
          <Flex vertical gap={16}>
            <Flex align="center" gap={12}>
              <MailOutlined style={{ color: "#666" }} />
              <Text style={{ color: "#666" }}>akashhimalaya099@gmail.com</Text>
            </Flex>
            <Flex align="center" gap={12}>
              <EnvironmentOutlined style={{ color: "#666" }} />
              <Text style={{ color: "#666" }}>Kathmandu, Nepal</Text>
            </Flex>
            <Flex align="center" gap={12}>
              <PhoneOutlined style={{ color: "#666" }} />
              <Text style={{ color: "#666" }}>+977 9800795525</Text>
            </Flex>
          </Flex>
        </Col>
      </Row>

      {/* Bottom Bar */}
      <div
        style={{
          marginTop: "80px",
          paddingTop: "24px",
          borderTop: "1px solid #EEE",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col xs={24} md={12}>
            <Text style={{ fontSize: "12px", color: "#999" }}>
              © 2026 Era Escape. All paths lead home.
            </Text>
          </Col>
          <Col xs={24} md={12}>
            <Flex gap={24} justify="end" className="footer-bottom-links">
              <Link href="#!" style={{ fontSize: "12px", color: "#999" }}>
                Privacy Policy
              </Link>
              <Link href="#!" style={{ fontSize: "12px", color: "#999" }}>
                Terms of Service
              </Link>
              <Link href="#!" style={{ fontSize: "12px", color: "#999" }}>
                Cookie Settings
              </Link>
            </Flex>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default CustomFooter;
