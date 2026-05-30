import React, { useState } from "react";
import { Typography, Divider, Modal, Button } from "antd";
import {
  WiHumidity,
  WiStrongWind,
  WiRain,
  WiDaySunny,
  WiCloudy,
  WiRaindrops,
  WiThunderstorm,
  WiDayHaze,
  WiSunrise,
  WiNightClear,
} from "react-icons/wi";
import moment from "moment";
import { FaCalendarAlt, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaSun, FaLeaf } from "react-icons/fa";

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

interface HikeWeatherProps {
  weather: {
    weatherData: WeatherData;
    source: string;
    updatedAt: string;
  };
  locationName?: string;
}

const HikeWeather: React.FC<HikeWeatherProps> = ({ weather, locationName }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  if (!weather || !weather?.weatherData || !weather?.weatherData?.hourly) {
    return null;
  }

  const hourlyData = weather?.weatherData?.hourly || [];
  const currentTime = moment();

  let currentData = hourlyData.find((h) =>
    moment(h?.time).isSame(currentTime, "hour"),
  );

  if (!currentData && hourlyData.length > 0) {
    currentData = hourlyData.reduce((prev, curr) => {
      const prevDiff = Math.abs(moment(prev?.time).diff(currentTime));
      const currDiff = Math.abs(moment(curr?.time).diff(currentTime));
      return currDiff < prevDiff ? curr : prev;
    });
  }

  if (!currentData) currentData = hourlyData[0];

  const getWeatherIcon = (data: Partial<WeatherHour> | undefined, size = 48, color = "#fff") => {
    const precip = data?.precipitation || 0;
    const humid = data?.humidity || 0;
    if (precip > 5) return <WiThunderstorm size={size} color={color} />;
    if (precip > 0) return <WiRain size={size} color={color} />;
    if (humid > 80) return <WiCloudy size={size} color={color} />;
    if (humid > 50) return <WiDayHaze size={size} color={color} />;
    return <WiDaySunny size={size} color={color} />;
  };

  const getWeatherDescription = (data: Partial<WeatherHour> | undefined) => {
    const precip = data?.precipitation || 0;
    const humid = data?.humidity || 0;
    if (precip > 5) return "Stormy";
    if (precip > 0) return "Rainy";
    if (humid > 80) return "Cloudy";
    if (humid > 50) return "Partly Cloudy";
    return "Clear Sky";
  };

  const aggregateDailyWeather = (hours: WeatherHour[]) => {
    const dailyMap = new Map<string, WeatherHour[]>();
    
    hours?.forEach((hour) => {
      if (!hour?.time) return;
      const dayKey = moment(hour.time).format("YYYY-MM-DD");
      if (!dailyMap.has(dayKey)) dailyMap.set(dayKey, []);
      dailyMap.get(dayKey)!.push(hour);
    });

    const dailyStats = Array.from(dailyMap.entries()).map(([date, dayHours]) => {
      const maxTemp = Math.max(...dayHours.map((h) => h?.temperature || 0));
      const minTemp = Math.min(...dayHours.map((h) => h?.temperature || 0));
      const totalPrecip = dayHours.reduce((sum, h) => sum + (h?.precipitation || 0), 0);
      const avgHumidity = Math.round(dayHours.reduce((sum, h) => sum + (h?.humidity || 0), 0) / (dayHours.length || 1));
      const maxWindSpeed = Math.max(...dayHours.map((h) => h?.windSpeed || 0));

      return {
        date,
        dayName: moment(date).format("ddd D"),
        maxTemp: Math.round(maxTemp),
        minTemp: Math.round(minTemp),
        totalPrecip: Number(totalPrecip.toFixed(1)),
        avgHumidity,
        maxWindSpeed: Number(maxWindSpeed.toFixed(1)),
        hours: dayHours,
        pseudoHour: {
          precipitation: totalPrecip,
          humidity: avgHumidity
        }
      };
    });

    return dailyStats.slice(0, 7);
  };

  const dailyData = aggregateDailyWeather(hourlyData);

  const getPeriodData = (hours: WeatherHour[], startHour: number, endHour: number) => {
    const periodHours = hours?.filter(h => {
      const hour = moment(h?.time).hour();
      return hour >= startHour && hour <= endHour;
    });
    if (!periodHours || periodHours.length === 0) return null;

    const maxTemp = Math.max(...periodHours.map(h => h?.temperature || 0));
    const avgWind = periodHours.reduce((sum, h) => sum + (h?.windSpeed || 0), 0) / periodHours.length;
    const totalPrecip = periodHours.reduce((sum, h) => sum + (h?.precipitation || 0), 0);
    const avgHumid = periodHours.reduce((sum, h) => sum + (h?.humidity || 0), 0) / periodHours.length;

    return {
      temp: Math.round(maxTemp),
      wind: Math.round(avgWind),
      precip: Number(totalPrecip.toFixed(1)),
      pseudoHour: { precipitation: totalPrecip, humidity: avgHumid }
    };
  };

  const getHikerAdvisory = (day: any) => {
    const advisories = [];
    let severity: "success" | "warning" | "error" = "success";

    if (day?.totalPrecip > 15) {
      severity = "error";
      advisories.push("Heavy rain expected. Trails will be very muddy and slippery. Consider postponing your hike.");
    } else if (day?.totalPrecip > 2) {
      severity = "warning";
      advisories.push("Light rain expected. Wear waterproof boots and watch out for leeches in forest areas.");
    }

    if (day?.maxTemp > 30 && day?.avgHumidity > 60) {
      severity = "error";
      advisories.push("Extreme heat and humidity. High risk of dehydration. Hike early in the morning and carry abundant water.");
    } else if (day?.maxTemp > 25) {
      if (severity !== "error") severity = "warning";
      advisories.push("Warm weather. Ensure you have sun protection, a hat, and plenty of water.");
    }

    if (day?.maxWindSpeed > 20) {
      if (severity !== "error") severity = "warning";
      advisories.push("Breezy conditions. Be cautious on exposed ridges and viewpoints.");
    }

    if (day?.minTemp < 5) {
      if (severity !== "error") severity = "warning";
      advisories.push("Chilly morning temperatures. Dress in layers to start your hike.");
    }

    if (advisories.length === 0) {
      advisories.push("Perfect hiking weather! Enjoy clear trails and comfortable temperatures.");
    }

    return { advisories, severity };
  };

  const containerStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)",
    borderRadius: "20px",
    padding: "24px",
    color: "#166534",
    boxShadow: "0 8px 30px rgba(22, 101, 52, 0.04)",
    position: "relative",
    overflow: "hidden",
    border: "1px solid #dcfce7",
  };

  const glassCardStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "16px",
    border: "1px solid rgba(255, 255, 255, 0.9)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: "1 1 0",
    minWidth: "120px",
  };

  const themeColor = "#166534";
  const iconColor = "#22c55e";

  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={containerStyle}>
        <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.05, transform: "rotate(15deg)" }}>
          <FaLeaf size={160} color={themeColor} />
        </div>

        {/* Main Weather Info */}
        <div style={{ textAlign: "center", marginBottom: "32px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "8px" }}>
            {getWeatherIcon(currentData, 64, iconColor)}
            <span style={{ fontSize: "64px", fontWeight: 700, color: themeColor }}>
              {Math.round(currentData?.temperature || 0)}°C
            </span>
          </div>
          <Title level={4} style={{ color: themeColor, margin: 0, fontWeight: 700 }}>
            {getWeatherDescription(currentData)}
          </Title>
          <Text style={{ color: "#475569", fontSize: "14px" }}>
            Feels like {Math.round((currentData?.temperature || 0) + ((currentData?.humidity || 0) > 60 ? 1 : -1))}°C • {locationName}
          </Text>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px', position: "relative", zIndex: 1 }}>
          <div style={glassCardStyle}>
            <WiHumidity size={32} color={iconColor} />
            <Text style={{ color: "#334155", fontSize: "12px", fontWeight: 600, marginTop: '8px' }}>HUMIDITY</Text>
            <Text style={{ color: themeColor, fontWeight: 800, fontSize: '18px' }}>{currentData?.humidity || 0}%</Text>
          </div>
          <div style={glassCardStyle}>
            <WiStrongWind size={32} color={iconColor} />
            <Text style={{ color: "#334155", fontSize: "12px", fontWeight: 600, marginTop: '8px' }}>WIND</Text>
            <Text style={{ color: themeColor, fontWeight: 800, fontSize: '18px' }}>{currentData?.windSpeed || 0} km/h</Text>
          </div>
          <div style={glassCardStyle}>
            <WiRaindrops size={32} color={iconColor} />
            <Text style={{ color: "#334155", fontSize: "12px", fontWeight: 600, marginTop: '8px' }}>PRECIP</Text>
            <Text style={{ color: themeColor, fontWeight: 800, fontSize: '18px' }}>{currentData?.precipitation || 0} mm</Text>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center', position: "relative", zIndex: 1 }}>
          <Button
            type="primary"
            size="large"
            icon={<FaCalendarAlt />}
            onClick={() => setIsModalVisible(true)}
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              borderRadius: "12px",
              padding: "0 32px",
              height: "48px",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            Check 7-Day Forecast
          </Button>
        </div>

        {/* Footer info */}
        <div style={{ marginTop: "32px", textAlign: "center", fontSize: "11px", color: "#64748b", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "12px", fontWeight: 500 }}>
            @ Last updated: {moment(weather?.updatedAt).calendar()}
          </div>
          <Divider style={{ borderColor: "rgba(22, 101, 52, 0.1)", margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <span style={{ textTransform: "uppercase", fontSize: "10px", background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, border: "1px solid #bbf7d0" }}>
              Source: {weather?.source || "open-meteo"}
            </span>
          </div>
        </div>
      </div>

      <Modal
        title={null}
        footer={null}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={950}
        centered
        styles={{
          content: {
            background: "linear-gradient(to bottom right, #f8fafc, #f0fdf4)",
            padding: "32px",
            borderRadius: "24px",
          },
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <Title level={2} style={{ color: "#0f172a", margin: 0, fontWeight: 800 }}>
            7-Day Hike Forecast
          </Title>
          <Text style={{ color: "#475569", fontSize: "16px", fontWeight: 500 }}>
            {locationName || "Hike Location"}
          </Text>
        </div>

        {/* 7-Day Cards Container */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            paddingBottom: "16px",
            marginBottom: "24px",
          }}
          className="custom-weather-scrollbar"
        >
          {dailyData?.map((day, idx) => {
            const isActive = idx === activeDayIndex;
            return (
              <div
                key={day?.date}
                onClick={() => setActiveDayIndex(idx)}
                style={{
                  background: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                  border: isActive ? "2px solid #22c55e" : "1px solid rgba(255,255,255,0.8)",
                  borderRadius: "16px",
                  marginTop: "8px",
                  padding: "16px 12px",
                  minWidth: "120px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: isActive ? "0 10px 25px rgba(34, 197, 94, 0.15)" : "0 4px 6px rgba(0,0,0,0.02)",
                  transform: isActive ? "translateY(-4px)" : "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: isActive ? "#0f172a" : "#64748b", fontSize: "12px", fontWeight: 800, textTransform: "uppercase" }}>
                  {day?.dayName}
                </Text>
                
                <div style={{ margin: "16px 0" }}>
                  {getWeatherIcon(day?.pseudoHour, 48, isActive ? "#16a34a" : "#22c55e")}
                </div>

                <div style={{ marginBottom: "4px" }}>
                  <Text style={{ fontWeight: 800, fontSize: "16px", color: "#0f172a" }}>{day?.maxTemp}°</Text>
                  <Text style={{ fontWeight: 500, fontSize: "14px", color: "#64748b", marginLeft: "4px" }}>/ {day?.minTemp}°</Text>
                </div>
                
                <Text style={{ fontSize: "12px", color: "#475569", fontWeight: 600, marginBottom: "16px" }}>
                  {getWeatherDescription(day?.pseudoHour)}
                </Text>

                {/* Small details grid */}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <WiRaindrops size={16} color="#64748b" />
                    <Text style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>{day?.totalPrecip}mm</Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <WiHumidity size={16} color="#64748b" />
                    <Text style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>{day?.avgHumidity}%</Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <WiStrongWind size={16} color="#64748b" />
                    <Text style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>{day?.maxWindSpeed}km/h</Text>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Day Details Section */}
        {dailyData[activeDayIndex] && (
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", animation: "fadeIn 0.5s ease-out" }}>
            
            {/* Period Breakdown */}
            <div style={{ flex: "2 1 400px", background: "#ffffff", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
              <Title level={5} style={{ margin: "0 0 20px 0", color: "#0f172a" }}>Daily Hike Conditions</Title>
              
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {[
                  { label: "Morning", data: getPeriodData(dailyData[activeDayIndex]?.hours || [], 6, 11), icon: <WiSunrise size={36} color="#f59e0b" /> },
                  { label: "Afternoon", data: getPeriodData(dailyData[activeDayIndex]?.hours || [], 12, 17), icon: <WiDaySunny size={36} color="#f59e0b" /> },
                  { label: "Evening", data: getPeriodData(dailyData[activeDayIndex]?.hours || [], 18, 23), icon: <WiNightClear size={36} color="#334155" /> },
                ].map((period, i) => (
                  period.data && (
                    <div key={i} style={{ flex: "1 1 120px", background: "#f8fafc", borderRadius: "12px", padding: "16px", border: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <Text style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>{period.label}</Text>
                        {period.icon}
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "12px" }}>
                        <Text style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>{period?.data?.temp}°</Text>
                        {getWeatherIcon(period?.data?.pseudoHour, 24, "#22c55e")}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <WiRaindrops size={16} color="#64748b" />
                          <Text style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>{period?.data?.precip}mm</Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <FaSun size={12} color="#64748b" style={{ marginLeft: "2px", marginRight: "2px" }} />
                          <Text style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>UV: {period.label === 'Afternoon' ? 'High' : 'Low'}</Text>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Hiker Advisory */}
            <div style={{ flex: "1 1 300px", background: "#ffffff", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Title level={5} style={{ margin: 0, color: "#0f172a" }}>Hiker's Advisory</Title>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                {(() => {
                  const advisoryInfo = getHikerAdvisory(dailyData[activeDayIndex]);
                  const colors = {
                    success: { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", icon: <FaCheckCircle color="#22c55e" /> },
                    warning: { bg: "#fffbeb", border: "#fde68a", text: "#92400e", icon: <FaExclamationTriangle color="#f59e0b" /> },
                    error: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", icon: <FaInfoCircle color="#ef4444" /> }
                  };
                  const style = colors[advisoryInfo.severity];

                  return advisoryInfo.advisories.map((adv, i) => (
                    <div key={i} style={{ background: style.bg, border: `1px solid ${style.border}`, padding: "16px", borderRadius: "12px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <div style={{ marginTop: "2px" }}>{style.icon}</div>
                      <Text style={{ color: style.text, fontWeight: 500, fontSize: "14px", lineHeight: "1.5" }}>{adv}</Text>
                    </div>
                  ));
                })()}
              </div>
            </div>

          </div>
        )}
      </Modal>

      <style>{`
        .custom-weather-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-weather-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-weather-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.3);
          border-radius: 10px;
        }
        .custom-weather-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.5);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HikeWeather;
