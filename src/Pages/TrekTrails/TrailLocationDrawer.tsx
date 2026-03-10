import React, { useState } from "react";
import {
  Drawer,
  Card,
  Button,
  Typography,
  Space,
  Tag,
  List,
  Modal,
  Carousel,
  Image,
  Divider,
  Avatar,
} from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  TeamOutlined,
  HomeOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useFetchDestinationHotels } from "@/services/trekServices/trekServices";
import { hotelTypeOptions } from "@/constant/constant";

const { Title, Text } = Typography;

interface TrailLocationDrawerProps {
  open: boolean;
  onClose: () => void;
  destinationSlug?: string;
}

const TrailLocationDrawer: React.FC<TrailLocationDrawerProps> = ({
  open,
  onClose,
  destinationSlug,
}) => {
  const { slug } = useParams();
  const { data } = useFetchDestinationHotels({
    trekBlogSlug: slug || "",
    destinationSlug: destinationSlug || "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  const destination = data?.destination;
  const hotels = data?.hotels || [];
  const multipleRouteTimes =
    destination?.multipleDestinationRouteTime?.length > 0
      ? destination.multipleDestinationRouteTime
      : destination?.routeTimes || [];
  const shouldShowMultipleRouteTimes =
    destination?.hasMultipleNextDestination && multipleRouteTimes.length > 0;

  const getHotelTypeLabel = (value: string) => {
    return hotelTypeOptions.find((opt) => opt.value === value)?.label || value;
  };

  const handleViewDetails = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const baseUrl = import.meta.env.VITE_API_URL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${cleanBaseUrl}/${cleanPath}`;
  };

  // Pastel Green-Blue Theme Colors
  const themeColor = "#00474f"; // Dark Cyan/Teal for text
  const primaryColor = "#13c2c2"; // Cyan for buttons
  const secondaryColor = "#52c41a"; // Green for accents
  const lightBg = "#f0fcf9"; // Very light mint/cyan background
  const cardBg = "#ffffff";

  // Gradient for Header: Light Cyan to Light Green
  const headerGradient = "linear-gradient(135deg, #e6fffb 0%, #f6ffed 100%)";

  return (
    <>
      <Drawer
        title={null}
        placement="right"
        onClose={onClose}
        open={open}
        width={500}
        mask={true}
        styles={{
          body: {
            padding: 0,
            background: "#f8fafc",
          },
        }}
        closeIcon={
          <div
            style={{
              background: "white",
              borderRadius: "50%",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <RightOutlined style={{ fontSize: "16px", color: themeColor }} />
          </div>
        }
      >
        {/* Header Section with Light Gradient */}
        <div
          style={{
            background: headerGradient,
            padding: "40px 24px 24px",
            color: themeColor,
            position: "relative",
            overflow: "hidden",
            borderBottom: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "url('https://www.transparenttextures.com/patterns/cubes.png')",
              opacity: 0.05,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <Tag
              color="white"
              style={{
                border: "none",
                color: themeColor,
                marginBottom: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                fontWeight: 600,
              }}
            >
              <EnvironmentOutlined /> Destination
            </Tag>
            <Title
              level={2}
              style={{
                margin: "0 0 8px 0",
                color: themeColor,
                fontWeight: 700,
              }}
            >
              {destination?.name || destinationSlug}
            </Title>
            <Space size={16} style={{ opacity: 0.8, color: themeColor }}>
              <Space>
                <RiseOutlined /> {destination?.altitude}m Altitude
              </Space>
            </Space>
            {shouldShowMultipleRouteTimes ? (
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  opacity: 0.85,
                }}
              >
                {multipleRouteTimes?.map((rt: any, idx: number) => (
                  <Space key={`${rt?._id || idx}`} style={{ color: themeColor }}>
                    <ClockCircleOutlined />
                    <span>
                      {rt?.timeToTravel} hrs to{" "}
                      {rt?.toTrailDestination?.name || "next destination"}
                    </span>
                  </Space>
                ))}
              </div>
            ) : (
              (destination?.travelTimeToNext !== null &&
                destination?.travelTimeToNext !== undefined) && (
                <Space
                  style={{
                    marginTop: "10px",
                    opacity: 0.85,
                    color: themeColor,
                  }}
                >
                  <Space>
                    <ClockCircleOutlined /> {destination?.travelTimeToNext} hrs
                    to next
                  </Space>
                </Space>
              )
            )}
          </div>
        </div>

        <div style={{ padding: "24px" }}>
          {destination && (
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    background: cardBg,
                    padding: "16px",
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                    border: `1px solid ${lightBg}`,
                  }}
                >
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "12px",
                      display: "block",
                      marginBottom: "8px",
                      color: themeColor,
                      fontWeight: 600,
                      opacity: 0.7,
                    }}
                  >
                    FACILITIES
                  </Text>
                  <List
                    size="small"
                    split={false}
                    dataSource={destination.facilities}
                    renderItem={(item: any) => (
                      <List.Item style={{ padding: "2px 0" }}>
                        <Text style={{ fontSize: "13px", color: "#444" }}>
                          <CheckCircleOutlined
                            style={{
                              color: secondaryColor,
                              marginRight: "6px",
                            }}
                          />
                          {item}
                        </Text>
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <Title level={4} style={{ margin: 0, color: "#333" }}>
              Accommodations
            </Title>
            <Tag
              color={primaryColor}
              style={{ borderRadius: "12px", border: "none" }}
            >
              {hotels.length} Available
            </Tag>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {hotels?.map((hotel: any) => (
              <Card
                key={hotel._id}
                hoverable
                bordered={false}
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                  transition: "all 0.3s ease",
                  background: cardBg,
                }}
                bodyStyle={{ padding: "0" }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", height: "180px" }}>
                    {hotel.images && hotel.images.length > 0 ? (
                      <img
                        alt={hotel.title}
                        src={getImageUrl(hotel.images[0].path)}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          width: "100%",
                          background: "#f0f2f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <HomeOutlined
                          style={{ fontSize: "32px", color: "#bfbfbf" }}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      {hotel?.hotelType?.map((type: string) => (
                        <Tag
                          key={type}
                          color="rgba(255,255,255,0.9)"
                          style={{
                            border: "none",
                            color: themeColor,
                            borderRadius: "8px",
                            margin: 0,
                            fontWeight: 600,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          {getHotelTypeLabel(type)}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "12px",
                      }}
                    >
                      <Title level={5} style={{ margin: 0, fontSize: "18px" }}>
                        {hotel.title}
                      </Title>
                    </div>

                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: "100%", marginBottom: "20px" }}
                    >
                      <Space>
                        <Avatar
                          size="small"
                          icon={<PhoneOutlined />}
                          style={{
                            backgroundColor: lightBg,
                            color: themeColor,
                          }}
                        />
                        <Text>{hotel.phoneNumber}</Text>
                      </Space>
                      {hotel.secondaryPhoneNumbers?.length > 0 && (
                        <Space>
                          <Avatar
                            size="small"
                            icon={<PhoneOutlined />}
                            style={{
                              backgroundColor: lightBg,
                              color: themeColor,
                            }}
                          />
                          <Text type="secondary">
                            {hotel.secondaryPhoneNumbers.join(", ")}
                          </Text>
                        </Space>
                      )}
                    </Space>

                    <Button
                      type="primary"
                      block
                      size="large"
                      style={{
                        borderRadius: "12px",
                        height: "44px",
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                        boxShadow: "0 4px 14px rgba(19, 194, 194, 0.3)",
                        border: "none",
                        fontWeight: 600,
                      }}
                      onClick={() => handleViewDetails(hotel)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Drawer>

      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        centered
        styles={{
          content: {
            borderRadius: "24px",
            padding: "1rem",
            overflow: "hidden",
          },
        }}
        closeIcon={
          <div
            style={{
              background: "white",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>×</span>
          </div>
        }
      >
        {selectedHotel && (
          <div style={{ maxHeight: "800px", overflowY: "auto" }}>
            {selectedHotel.images && selectedHotel.images.length > 0 && (
              <Carousel autoplay effect="fade">
                {selectedHotel.images.map((img: any) => (
                  <div key={img._id}>
                    <div
                      style={{
                        height: "400px",
                        width: "100%",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#f0f0f0",
                      }}
                    >
                      <Image
                        src={getImageUrl(img.path)}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                        preview={false}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                          padding: "40px 24px 24px",
                          color: "white",
                        }}
                      >
                        <Title level={3} style={{ color: "white", margin: 0 }}>
                          {selectedHotel.title}
                        </Title>
                        <Space style={{ marginTop: "8px" }}>
                          <Tag color="cyan">
                            {selectedHotel.hotelType
                              ?.map((type: string) => getHotelTypeLabel(type))
                              .join(", ")}
                          </Tag>
                        </Space>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            )}

            <div style={{ padding: "32px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "32px",
                }}
              >
                <div>
                  {selectedHotel.description && (
                    <>
                      <Title level={5}>About this place</Title>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedHotel.description,
                        }}
                        style={{ color: "#666", lineHeight: "1.6" }}
                      />
                      <Divider />
                    </>
                  )}

                  {selectedHotel.facilities &&
                    selectedHotel.facilities.length > 0 && (
                      <>
                        <Title level={5}>Amenities</Title>
                        <Space wrap size={[8, 12]}>
                          {selectedHotel.facilities?.map((f: string) => (
                            <Tag
                              key={f}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                fontSize: "14px",
                                border: "1px solid #d9d9d9",
                                background: "transparent",
                                color: themeColor,
                              }}
                            >
                              {f}
                            </Tag>
                          ))}
                        </Space>
                      </>
                    )}
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    padding: "24px",
                    borderRadius: "16px",
                    height: "fit-content",
                    border: `1px solid ${lightBg}`,
                  }}
                >
                  <Title level={5} style={{ marginTop: 0 }}>
                    Property Details
                  </Title>
                  <Space
                    direction="vertical"
                    size={16}
                    style={{ width: "100%" }}
                  >
                    {selectedHotel.proprietorName && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <Avatar
                          icon={<TeamOutlined />}
                          style={{
                            backgroundColor: lightBg,
                            color: themeColor,
                          }}
                        />
                        <div>
                          <Text
                            type="secondary"
                            style={{ fontSize: "12px", display: "block" }}
                          >
                            Proprietor
                          </Text>
                          <Text strong>{selectedHotel.proprietorName}</Text>
                        </div>
                      </div>
                    )}

                    {selectedHotel.establishedDate && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <Avatar
                          icon={<CalendarOutlined />}
                          style={{
                            backgroundColor: lightBg,
                            color: themeColor,
                          }}
                        />
                        <div>
                          <Text
                            type="secondary"
                            style={{ fontSize: "12px", display: "block" }}
                          >
                            Established
                          </Text>
                          <Text strong>{selectedHotel.establishedDate}</Text>
                        </div>
                      </div>
                    )}

                    {(selectedHotel.totalRooms ||
                      selectedHotel.approximateTravellersCapacity) && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <Avatar
                          icon={<HomeOutlined />}
                          style={{
                            backgroundColor: lightBg,
                            color: themeColor,
                          }}
                        />
                        <div>
                          <Text
                            type="secondary"
                            style={{ fontSize: "12px", display: "block" }}
                          >
                            Capacity
                          </Text>
                          <Text strong>
                            {selectedHotel.totalRooms &&
                              `${selectedHotel.totalRooms} Rooms`}
                            {selectedHotel.totalRooms &&
                              selectedHotel.approximateTravellersCapacity &&
                              " • "}
                            {selectedHotel.approximateTravellersCapacity &&
                              `${selectedHotel.approximateTravellersCapacity} Guests`}
                          </Text>
                        </div>
                      </div>
                    )}

                    <Divider style={{ margin: "12px 0" }} />

                    {selectedHotel.phoneNumber && (
                      <Button
                        type="primary"
                        block
                        icon={<PhoneOutlined />}
                        size="large"
                        style={{
                          borderRadius: "8px",
                          background: primaryColor,
                          border: "none",
                        }}
                      >
                        {selectedHotel.phoneNumber}
                      </Button>
                    )}

                    {selectedHotel.email && (
                      <Button
                        block
                        icon={<MailOutlined />}
                        size="large"
                        style={{
                          borderRadius: "8px",
                          borderColor: primaryColor,
                          color: themeColor,
                        }}
                      >
                        {selectedHotel.email}
                      </Button>
                    )}

                    {selectedHotel.secondaryPhoneNumbers?.length > 0 && (
                      <div style={{ marginTop: "8px" }}>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: "12px",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Alternative Contacts
                        </Text>
                        <Space
                          direction="vertical"
                          size={8}
                          style={{ width: "100%" }}
                        >
                          {selectedHotel.secondaryPhoneNumbers.map(
                            (phone: string, index: number) => (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "8px 12px",
                                  background: "white",
                                  borderRadius: "6px",
                                  border: `1px solid ${lightBg}`,
                                  color: themeColor,
                                  fontSize: "13px",
                                }}
                              >
                                <PhoneOutlined
                                  style={{ fontSize: "12px", opacity: 0.7 }}
                                />
                                {phone}
                              </div>
                            ),
                          )}
                        </Space>
                      </div>
                    )}
                  </Space>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TrailLocationDrawer;
