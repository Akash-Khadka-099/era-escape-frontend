import React, { useState } from "react";
import { Typography, Tag, Space, Divider } from "antd";
import {
  WiHumidity,
  WiStrongWind,
  WiRain,
  WiBarometer,
  WiDaySunny,
  WiCloudy,
  WiRaindrops,
  WiFog,
} from "react-icons/wi";
import moment from "moment";

const { Title, Text } = Typography;

interface WeatherHour {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  _id: string;
}

interface WeatherData {
  timezone: string;
  hourly: WeatherHour[];
}

interface TrekWeatherProps {
  weather: {
    weatherData: WeatherData;
    source: string;
    updatedAt: string;
  };
  locationName?: string;
}

const TrekWeather: React.FC<TrekWeatherProps> = ({ weather, locationName }) => {
  const [activeTab, setActiveTab] = useState<"details" | "hourly">("details");

  if (!weather || !weather.weatherData || !weather.weatherData.hourly) {
    return null;
  }

  const hourlyData = weather.weatherData.hourly;

  // Find the weather data for the current hour, or the nearest available time
  const currentTime = moment();

  // 1. Try to find exact match for current hour
  let currentData = hourlyData.find((h) =>
    moment(h.time).isSame(currentTime, "hour"),
  );

  // 2. If not found, find the one with the smallest time difference (nearest)
  if (!currentData && hourlyData.length > 0) {
    currentData = hourlyData.reduce((prev, curr) => {
      const prevDiff = Math.abs(moment(prev.time).diff(currentTime));
      const currDiff = Math.abs(moment(curr.time).diff(currentTime));
      return currDiff < prevDiff ? curr : prev;
    });
  }

  // 3. Last fallback
  if (!currentData) currentData = hourlyData[0];

  const getWeatherIcon = (data: WeatherHour) => {
    if (data.precipitation > 0) return <WiRain size={48} color="#fff" />;
    if (data.humidity > 70) return <WiCloudy size={48} color="#fff" />;
    return <WiDaySunny size={48} color="#fff" />;
  };

  const getWeatherDescription = (data: WeatherHour) => {
    if (data.precipitation > 0) return "Rainy";
    if (data.humidity > 70) return "Cloudy";
    if (data.humidity > 50) return "Partly Cloudy";
    return "Clear Sky";
  };

  const containerStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #f7feff 0%, #fafffe 100%)",
    borderRadius: "24px",
    padding: "24px",
    color: "#155e75",
    boxShadow: "0 10px 40px rgba(21, 94, 117, 0.03)",
    position: "relative",
    overflow: "hidden",
    border: "1px solid #f0f9ff",
  };

  const glassCardStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "12px 16px",
    border: "1px solid rgba(255, 255, 255, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  };

  const themeColor = "#155e75";
  const iconColor = "#0891b2";

  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={containerStyle}>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
            background: "rgba(255, 255, 255, 0.6)",
            borderRadius: "12px",
            padding: "4px",
            width: "fit-content",
            margin: "0 auto 24px auto",
            border: "1px solid #e0f2fe",
          }}
        >
          <div
            onClick={() => setActiveTab("details")}
            style={{
              padding: "6px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              background: activeTab === "details" ? "#fff" : "transparent",
              color: activeTab === "details" ? "#0369a1" : "#4b5563",
              transition: "all 0.3s ease",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow:
                activeTab === "details" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
            }}
          >
            Details
          </div>
          <div
            onClick={() => setActiveTab("hourly")}
            style={{
              padding: "6px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              background: activeTab === "hourly" ? "#fff" : "transparent",
              color: activeTab === "hourly" ? "#0369a1" : "#4b5563",
              transition: "all 0.3s ease",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow:
                activeTab === "hourly" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
            }}
          >
            Hourly
          </div>
        </div>

        {activeTab === "details" ? (
          <div style={{ animation: "fadeIn 0.5s ease-out" }}>
            {/* Main Weather Info */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                {/* Override icon size and color locally for main info */}
                {React.cloneElement(
                  getWeatherIcon(currentData) as React.ReactElement,
                  { size: 64, color: iconColor },
                )}
                <span
                  style={{
                    fontSize: "64px",
                    fontWeight: 700,
                    color: themeColor,
                  }}
                >
                  {Math.round(currentData.temperature)}°C
                </span>
              </div>
              <Title
                level={4}
                style={{ color: themeColor, margin: 0, fontWeight: 700 }}
              >
                {getWeatherDescription(currentData)}
              </Title>
              <Text style={{ color: "#4b5563", fontSize: "14px" }}>
                Feels like {Math.round(currentData.temperature - 2)}°C •{" "}
                {locationName}
              </Text>
            </div>

            {/* Stats List */}
            <div style={glassCardStyle}>
              <Space>
                <WiHumidity size={24} color={iconColor} />
                <Text
                  style={{
                    color: "#374151",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  HUMIDITY
                </Text>
              </Space>
              <Text style={{ color: themeColor, fontWeight: 700 }}>
                {currentData.humidity}%
              </Text>
            </div>

            <div style={glassCardStyle}>
              <Space>
                <WiStrongWind size={24} color={iconColor} />
                <Text
                  style={{
                    color: "#374151",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  WIND
                </Text>
              </Space>
              <Text style={{ color: themeColor, fontWeight: 700 }}>
                {currentData.windSpeed} km/h
              </Text>
            </div>

            <div style={glassCardStyle}>
              <Space>
                <WiRaindrops size={24} color={iconColor} />
                <Text
                  style={{
                    color: "#374151",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  PRECIP
                </Text>
              </Space>
              <Text style={{ color: themeColor, fontWeight: 700 }}>
                {currentData.precipitation}%
              </Text>
            </div>

            <div style={glassCardStyle}>
              <Space>
                <WiDaySunny size={24} color={iconColor} />
                <Text
                  style={{
                    color: "#374151",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  UV INDEX
                </Text>
              </Space>
              <Tag
                style={{
                  background: "#e0f2fe",
                  border: "1px solid #bae6fd",
                  color: "#0369a1",
                  margin: 0,
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Moderate
              </Tag>
            </div>

            <div style={glassCardStyle}>
              <Space>
                <WiFog size={24} color={iconColor} />
                <Text
                  style={{
                    color: "#374151",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  VISIBILITY
                </Text>
              </Space>
              <Text style={{ color: themeColor, fontWeight: 700 }}>15 km</Text>
            </div>

            <div style={glassCardStyle}>
              <Space>
                <WiBarometer size={24} color={iconColor} />
                <Text
                  style={{
                    color: "#374151",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  PRESSURE
                </Text>
              </Space>
              <Text style={{ color: themeColor, fontWeight: 700 }}>
                1012 hPa
              </Text>
            </div>
          </div>
        ) : (
          <div
            style={{
              maxHeight: "450px",
              overflowY: "auto",
              paddingRight: "4px",
              animation: "fadeIn 0.5s ease-out",
            }}
            className="custom-weather-scrollbar"
          >
            {hourlyData.slice(0, 24).map((hour, index) => {
              const isCurrentHour = moment(hour.time).isSame(moment(), "hour");
              return (
                <div
                  key={hour._id || index}
                  style={{
                    ...glassCardStyle,
                    border: isCurrentHour
                      ? `1px solid ${iconColor}`
                      : glassCardStyle.border,
                    background: isCurrentHour
                      ? "rgba(255, 255, 255, 0.8)"
                      : glassCardStyle.background,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Text
                      style={{
                        color: isCurrentHour ? iconColor : "#6b7280",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {isCurrentHour ? "NOW" : moment(hour.time).format("h A")}
                    </Text>
                    <Text style={{ color: themeColor, fontWeight: 600 }}>
                      {moment(hour.time).format("HH:mm")}
                    </Text>
                  </div>
                  {React.cloneElement(
                    getWeatherIcon(hour) as React.ReactElement,
                    { size: 32, color: iconColor },
                  )}
                  <div
                    style={{
                      background: "rgba(8, 145, 178, 0.1)",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <WiStrongWind size={18} color={iconColor} />
                    <Text
                      style={{
                        color: themeColor,
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {hour.windSpeed}km/h
                    </Text>
                  </div>
                  <Text
                    style={{
                      color: themeColor,
                      fontWeight: 800,
                      fontSize: "18px",
                    }}
                  >
                    {Math.round(hour.temperature)}°
                  </Text>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "11px",
            color: "#6b7280",
          }}
        >
          <div style={{ marginBottom: "12px", fontWeight: 500 }}>
            @ Last updated: {moment(weather.updatedAt).calendar()}
          </div>
          <Divider
            style={{ borderColor: "rgba(21, 94, 117, 0.1)", margin: "12px 0" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                letterSpacing: "1px",
                color: themeColor,
              }}
            >
              24-HOUR FORECAST
            </span>
            <span
              style={{
                textTransform: "uppercase",
                fontSize: "10px",
                background: "#e0f2fe",
                color: "#0369a1",
                padding: "2px 8px",
                borderRadius: "4px",
                fontWeight: 700,
                border: "1px solid #bae6fd",
              }}
            >
              Source: {weather.source || "open-meteo"}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .custom-weather-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-weather-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-weather-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.3);
          border-radius: 10px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TrekWeather;
