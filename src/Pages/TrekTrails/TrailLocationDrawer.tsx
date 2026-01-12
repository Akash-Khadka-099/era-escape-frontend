import React from "react";
import {
  Drawer,
  Slider,
  Card,
  Button,
  Typography,
  Badge,
  Space,
} from "antd";
import {
  StarFilled,
  EnvironmentOutlined,
  CoffeeOutlined,
  WifiOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface TrailLocationDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
}

const dummyHotels = [
  {
    id: 1,
    name: "Mountain View Lodge",
    type: "Guesthouse",
    rating: 4.8,
    price: 1200,
    amenities: ["Wifi", "Breakfast"],
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 2,
    name: "River's Edge Hotel",
    type: "Hotel",
    rating: 4.5,
    price: 2500,
    amenities: ["Wifi", "Parking"],
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 3,
    name: "Alpine Base Camp",
    type: "Lodge",
    rating: 4.9,
    price: 800,
    amenities: ["Breakfast", "Hot Shower"],
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  },
];

const TrailLocationDrawer: React.FC<TrailLocationDrawerProps> = ({
  open,
  onClose,
  title,
}) => {
  return (
    <Drawer
      title={
        <div style={{ padding: "8px 0" }}>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <EnvironmentOutlined /> Nearby Accommodations
          </Text>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={420}
      mask={true}
      styles={{
        header: { borderBottom: "1px solid #f0f0f0" },
        body: { padding: "24px", background: "#fafafa" },
      }}
    >
      <div
        style={{
          marginBottom: "32px",
          background: "#fff",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Title level={5} style={{ marginBottom: "20px", fontSize: "16px" }}>
          Filter by Price
        </Title>
        <div style={{ padding: "0 10px" }}>
          <Slider
            range
            defaultValue={[500, 3000]}
            min={0}
            max={5000}
            step={100}
            marks={{ 0: "Rs0", 5000: "Rs5k" }}
            trackStyle={[{ backgroundColor: "#2ecc71" }]}
            handleStyle={[
              {
                borderColor: "#2ecc71",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              },
              {
                borderColor: "#2ecc71",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              },
            ]}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <Title level={5} style={{ margin: 0, fontSize: "16px" }}>
          Available Hotels ({dummyHotels.length})
        </Title>
        {dummyHotels.map((hotel) => (
          <Card
            key={hotel.id}
            hoverable
            cover={
              <div style={{ position: "relative" }}>
                <img
                  alt={hotel.name}
                  src={hotel.image}
                  style={{ height: "200px", width: "100%", objectFit: "cover" }}
                />
                <Badge
                  count={hotel.type}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(4px)",
                    border: "none",
                    padding: "0 12px",
                    height: "24px",
                    lineHeight: "24px",
                    borderRadius: "12px",
                  }}
                />
              </div>
            }
            bodyStyle={{ padding: "20px" }}
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              border: "none",
              boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "8px",
              }}
            >
              <Title level={5} style={{ margin: 0, fontSize: "17px" }}>
                {hotel.name}
              </Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "#fff9e6",
                  padding: "2px 8px",
                  borderRadius: "6px",
                }}
              >
                <StarFilled style={{ color: "#fadb14", fontSize: "14px" }} />
                <Text strong style={{ fontSize: "14px" }}>
                  {hotel.rating}
                </Text>
              </div>
            </div>

            <Space style={{ marginBottom: "16px" }} size={[8, 8]} wrap>
              {hotel.amenities.map((amenity) => (
                <Tag
                  key={amenity}
                  style={{
                    borderRadius: "4px",
                    border: "none",
                    background: "#f0f2f5",
                    fontSize: "11px",
                  }}
                >
                  {amenity === "Wifi" && <WifiOutlined />}
                  {amenity === "Breakfast" && <CoffeeOutlined />}
                  {amenity}
                </Tag>
              ))}
            </Space>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <div>
                <Text
                  type="secondary"
                  style={{ fontSize: "12px", display: "block" }}
                >
                  Starting from
                </Text>
                <Text strong style={{ fontSize: "18px", color: "#2ecc71" }}>
                  Rs {hotel.price}
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {" "}
                  / night
                </Text>
              </div>
              <Button
                type="primary"
                style={{
                  borderRadius: "10px",
                  height: "40px",
                  padding: "0 24px",
                  background: "#000",
                  border: "none",
                }}
              >
                Book Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Drawer>
  );
};

const Tag = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <span
    style={{
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "12px",
      background: "#f5f5f5",
      color: "#555",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      ...style,
    }}
  >
    {children}
  </span>
);

export default TrailLocationDrawer;
