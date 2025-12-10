import React from "react";
import { Layout, Row, Col, Typography, Flex } from "antd";

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const CustomFooter: React.FC = () => {
  return (
    <Footer style={{ background: "whitesmoke", marginTop: "1rem" }}>
      {/* Section: Social media */}
      <Row
        justify="space-between"
        align="middle"
        style={{ padding: "16px", borderBottom: "1px solid #ddd" }}
      >
        <Col xs={24} md={12} style={{ textAlign: "left" }}>
          <Text strong>Get connected with us on social networks:</Text>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: "right" }}>
          <Link
            href="#!"
            style={{ marginRight: "16px", textDecoration: "none" }}
          >
            {/* <Icon type="facebook" /> */}
            facebook
          </Link>
          <Link href="#!" style={{ marginRight: "16px" }}>
            {/* <Icon type="twitter" /> */}
            twitter
          </Link>
          <Link href="#!" style={{ marginRight: "16px" }}>
            {/* <Icon type="google" /> */}
            google
          </Link>
          <Link href="#!" style={{ marginRight: "16px" }}>
            {/* <Icon type="instagram" /> */}
            instagram
          </Link>
          <Link href="#!" style={{ marginRight: "16px" }}>
            {/* <Icon type="linkedin" /> */}
            linkedin
          </Link>
        </Col>
      </Row>

      {/* Section: Links */}
      <Row justify="center" style={{ padding: "24px 0" }}>
        <Col xs={24} md={6} style={{ padding: "0 16px" }}>
          <Title level={5}>
            {/* <Icon type="bank" style={{ marginRight: '8px' }} /> */}
            Company Name
          </Title>
          <Text>Tour and Travel package in Nepal</Text>
        </Col>

        <Col xs={24} md={6} style={{ padding: "0 16px" }}>
          <Title level={5}>Trip Ideas</Title>
          <Flex vertical>
            <Link href="#!">
              Travel
            </Link>
            <Link href="#!">
              Best Iteneries
            </Link>
            <Link href="#!">
              Authorized Organization
            </Link>
          </Flex>
        </Col>

        <Col xs={24} md={6} style={{ padding: "0 16px" }}>
          <Title level={5}>Useful Links</Title>
          <Flex vertical>
            <Link href="#!">
              Pricing
            </Link>
            <Link href="#!">
              Settings
            </Link>

            <Link href="#!">
              Help
            </Link>
          </Flex>
        </Col>

        <Col xs={24} md={6} style={{ padding: "0 16px" }}>
          <Title level={5}>Contact</Title>
          <Flex vertical>
            <Text>
              {/* <Icon type="home" style={{ marginRight: '8px' }} /> */}
             Nepal, Kathmandu
            </Text>
            <Text>
              {/* <Icon type="mail" style={{ marginRight: '8px' }} /> */}
              akashkhadka099@example.com
            </Text>
            <Text>
              {/* <Icon type="phone" style={{ marginRight: '8px' }} /> */}
              +977 9877777765
            </Text>
            <Text>
              {/* <Icon type="printer" style={{ marginRight: '8px' }} /> */}
              +977 9877777766
            </Text>
          </Flex>
        </Col>
      </Row>

      {/* Copyright */}
      <Row
        justify="center"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          padding: "16px",
          textAlign: "center",
        }}
      >
        <Col>
          <Text>
            © 2025 Copyright:{" "}
            <Link href="https://mdbootstrap.com/" target="_blank">
             PackageNepal.com
            </Link>
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};

export default CustomFooter;
