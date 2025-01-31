import { Layout, Row, Col, Typography, Flex } from "antd";

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const CustomFooter = () => {
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
          <Link  href="#!" style={{ marginRight: "16px", textDecoration: "none" }}>
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
          <Link href="#!" style={{ marginRight: "16px" }}>
            {/* <Icon type="github" /> */}
            gihub
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
          <Text>
            Here you can use rows and columns to organize your footer content.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </Text>
        </Col>

        <Col xs={24} md={6} style={{ padding: "0 16px" }}>
          <Title level={5}>Products</Title>
          <Flex vertical>
            <Link href="#!" block>
              Angular
            </Link>
            <Link href="#!" block>
              React
            </Link>
            <Link href="#!" block>
              Vue
            </Link>
            <Link href="#!" block>
              Laravel
            </Link>
          </Flex>
        </Col>

        <Col xs={24} md={6} style={{ padding: "0 16px" }}>
          <Title level={5}>Useful Links</Title>
          <Flex vertical>
            <Link href="#!" block>
              Pricing
            </Link>
            <Link href="#!" block>
              Settings
            </Link>
            <Link href="#!" block>
              Orders
            </Link>
            <Link href="#!" block>
              Help
            </Link>
          </Flex>
        </Col>

        <Col xs={24} md={6} style={{ padding: "0 16px" }}>
          <Title level={5}>Contact</Title>
          <Flex vertical>
            <Text>
              {/* <Icon type="home" style={{ marginRight: '8px' }} /> */}
              New York, NY 10012, US
            </Text>
            <Text>
              {/* <Icon type="mail" style={{ marginRight: '8px' }} /> */}
              info@example.com
            </Text>
            <Text>
              {/* <Icon type="phone" style={{ marginRight: '8px' }} /> */}
              +01 234 567 88
            </Text>
            <Text>
              {/* <Icon type="printer" style={{ marginRight: '8px' }} /> */}
              +01 234 567 89
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
            © 2021 Copyright:{" "}
            <Link href="https://mdbootstrap.com/" target="_blank">
              MDBootstrap.com
            </Link>
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};

export default CustomFooter;
