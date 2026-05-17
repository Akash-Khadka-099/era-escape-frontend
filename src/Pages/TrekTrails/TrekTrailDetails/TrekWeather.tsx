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
import { FaCalendarAlt, FaInfoCircle, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  if (!weather || !weather.weatherData || !weather.weatherData.hourly) {
    return null;
  }

  const hourlyData = weather.weatherData.hourly;

  const currentTime = moment();

  let currentData = hourlyData.find((h) =>
    moment(h.time).isSame(currentTime, "hour"),
  );

  if (!currentData && hourlyData.length > 0) {
    currentData = hourlyData.reduce((prev, curr) => {
      const prevDiff = Math.abs(moment(prev.time).diff(currentTime));
      const currDiff = Math.abs(moment(curr.time).diff(currentTime));
      return currDiff < prevDiff ? curr : prev;
    });
  }

  if (!currentData) currentData = hourlyData[0];

  const getWeatherIcon = (data: Partial<WeatherHour>, size = 48, color = "#fff") => {
    const precip = data.precipitation || 0;
    const humid = data.humidity || 0;
    if (precip > 5) return <WiThunderstorm size={size} color={color} />;
    if (precip > 0) return <WiRain size={size} color={color} />;
    if (humid > 80) return <WiCloudy size={size} color={color} />;
    if (humid > 50) return <WiDayHaze size={size} color={color} />;
    return <WiDaySunny size={size} color={color} />;
  };

  const getWeatherDescription = (data: Partial<WeatherHour>) => {
    const precip = data.precipitation || 0;
    const humid = data.humidity || 0;
    if (precip > 5) return "Stormy";
    if (precip > 0) return "Rainy";
    if (humid > 80) return "Cloudy";
    if (humid > 50) return "Partly Cloudy";
    return "Clear Sky";
  };

  const aggregateDailyWeather = (hours: WeatherHour[]) => {
    const dailyMap = new Map<string, WeatherHour[]>();
    
    hours.forEach((hour) => {
      const dayKey = moment(hour.time).format("YYYY-MM-DD");
      if (!dailyMap.has(dayKey)) dailyMap.set(dayKey, []);
      dailyMap.get(dayKey)!.push(hour);
    });

    const dailyStats = Array.from(dailyMap.entries()).map(([date, dayHours]) => {
      const maxTemp = Math.max(...dayHours.map((h) => h.temperature));
      const minTemp = Math.min(...dayHours.map((h) => h.temperature));
      const totalPrecip = dayHours.reduce((sum, h) => sum + h.precipitation, 0);
      const avgHumidity = Math.round(dayHours.reduce((sum, h) => sum + h.humidity, 0) / dayHours.length);
      const maxWindSpeed = Math.max(...dayHours.map((h) => h.windSpeed));

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
    const periodHours = hours.filter(h => {
      const hour = moment(h.time).hour();
      return hour >= startHour && hour <= endHour;
    });
    if (periodHours.length === 0) return null;

    const maxTemp = Math.max(...periodHours.map(h => h.temperature));
    const avgWind = periodHours.reduce((sum, h) => sum + h.windSpeed, 0) / periodHours.length;
    const totalPrecip = periodHours.reduce((sum, h) => sum + h.precipitation, 0);
    const avgHumid = periodHours.reduce((sum, h) => sum + h.humidity, 0) / periodHours.length;

    return {
      temp: Math.round(maxTemp),
      wind: Math.round(avgWind),
      precip: Number(totalPrecip.toFixed(1)),
      pseudoHour: { precipitation: totalPrecip, humidity: avgHumid }
    };
  };

  const getTrekkerAdvisory = (day: any) => {
    const advisories = [];
    let severity: "success" | "warning" | "error" = "success";

    if (day.totalPrecip > 10) {
      severity = "error";
      if (day.maxTemp < 2) {
        advisories.push("Heavy snow expected. Trails may be blocked. Crampons recommended.");
      } else {
        advisories.push("Heavy rain expected. High risk of leeches and slippery trails. Rain gear essential.");
      }
    } else if (day.totalPrecip > 2) {
      severity = "warning";
      if (day.maxTemp < 2) {
        advisories.push("Light snow expected. Watch your step on slippery rocks.");
      } else {
        advisories.push("Light rain expected. Keep a rain cover on your backpack.");
      }
    }

    if (day.maxWindSpeed > 25) {
      severity = "error";
      advisories.push("Gale-force winds. Crossing passes will be hazardous.");
    } else if (day.maxWindSpeed > 15) {
      if (severity !== "error") severity = "warning";
      advisories.push("Strong winds. Pack a solid windbreaker.");
    }

    if (day.minTemp < -10) {
      severity = "error";
      advisories.push("Dangerously cold night. Extreme cold weather gear required.");
    } else if (day.minTemp < 0) {
      if (severity !== "error") severity = "warning";
      advisories.push("Freezing night temperatures. Ensure good thermal layering.");
    }

    if (day.maxTemp > 25 && day.avgHumidity > 70) {
       if (severity !== "error") severity = "warning";
       advisories.push("High heat and humidity. Carry extra water.");
    }

    if (advisories.length === 0) {
      advisories.push("Excellent trekking conditions! Clear trails expected.");
    }

    return { advisories, severity };
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
    padding: "16px",
    border: "1px solid rgba(255, 255, 255, 0.9)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: "1 1 0",
    minWidth: "120px",
  };

  const themeColor = "#155e75";
  const iconColor = "#0891b2";

  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={containerStyle}>
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
            {getWeatherIcon(currentData, 64, iconColor)}
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

        {/* Stats Grid */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <div style={glassCardStyle}>
            <WiHumidity size={32} color={iconColor} />
            <Text style={{ color: "#374151", fontSize: "12px", fontWeight: 600, marginTop: '8px' }}>
              HUMIDITY
            </Text>
            <Text style={{ color: themeColor, fontWeight: 800, fontSize: '18px' }}>
              {currentData.humidity}%
            </Text>
          </div>
          <div style={glassCardStyle}>
            <WiStrongWind size={32} color={iconColor} />
            <Text style={{ color: "#374151", fontSize: "12px", fontWeight: 600, marginTop: '8px' }}>
              WIND
            </Text>
            <Text style={{ color: themeColor, fontWeight: 800, fontSize: '18px' }}>
              {currentData.windSpeed} km/h
            </Text>
          </div>
          <div style={glassCardStyle}>
            <WiRaindrops size={32} color={iconColor} />
            <Text style={{ color: "#374151", fontSize: "12px", fontWeight: 600, marginTop: '8px' }}>
              PRECIP
            </Text>
            <Text style={{ color: themeColor, fontWeight: 800, fontSize: '18px' }}>
              {currentData.precipitation} mm
            </Text>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            icon={<FaCalendarAlt />}
            onClick={() => setIsModalVisible(true)}
            style={{
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              border: "none",
              borderRadius: "12px",
              padding: "0 32px",
              height: "48px",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)",
            }}
          >
            View 7-Day Forecast
          </Button>
        </div>

        {/* Footer info */}
        <div
          style={{
            marginTop: "32px",
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
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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

      <Modal
        title={null}
        footer={null}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={950}
        centered
        styles={{
          content: {
            background: "linear-gradient(to bottom right, #f0f9ff, #e0f2fe)",
            padding: "32px",
            borderRadius: "24px",
          },
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <Title level={2} style={{ color: "#0f172a", margin: 0, fontWeight: 800 }}>
            7-Day Forecast
          </Title>
          <Text style={{ color: "#475569", fontSize: "16px", fontWeight: 500 }}>
            {locationName || "Location"}
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
                key={day.date}
                onClick={() => setActiveDayIndex(idx)}
                style={{
                  background: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                  border: isActive ? "2px solid #38bdf8" : "1px solid rgba(255,255,255,0.8)",
                  borderRadius: "16px",
                  marginTop: "8px",
                  padding: "16px 12px",
                  minWidth: "120px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: isActive
                    ? "0 10px 25px rgba(56, 189, 248, 0.15)"
                    : "0 4px 6px rgba(0,0,0,0.02)",
                  transform: isActive ? "translateY(-4px)" : "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: isActive ? "#0f172a" : "#64748b",
                    fontSize: "12px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  {day.dayName}
                </Text>
                
                <div style={{ margin: "16px 0" }}>
                  {getWeatherIcon(day.pseudoHour, 48, isActive ? "#0284c7" : "#0ea5e9")}
                </div>

                <div style={{ marginBottom: "4px" }}>
                  <Text style={{ fontWeight: 800, fontSize: "16px", color: "#0f172a" }}>
                    {day.maxTemp}°
                  </Text>
                  <Text style={{ fontWeight: 500, fontSize: "14px", color: "#64748b", marginLeft: "4px" }}>
                    / {day.minTemp}°
                  </Text>
                </div>
                
                <Text style={{ fontSize: "12px", color: "#475569", fontWeight: 600, marginBottom: "16px" }}>
                  {getWeatherDescription(day.pseudoHour)}
                </Text>

                {/* Small details grid */}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <WiRaindrops size={16} color="#64748b" />
                    <Text style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>{day.totalPrecip}mm</Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <WiHumidity size={16} color="#64748b" />
                    <Text style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>{day.avgHumidity}%</Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <WiStrongWind size={16} color="#64748b" />
                    <Text style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>{day.maxWindSpeed}km/h</Text>
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
            <div
              style={{
                flex: "2 1 400px",
                background: "#ffffff",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <Title level={5} style={{ margin: "0 0 20px 0", color: "#0f172a" }}>Daily Breakdown</Title>
              
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {[
                  { label: "Morning", data: getPeriodData(dailyData[activeDayIndex].hours, 6, 11), icon: <WiSunrise size={36} color="#0ea5e9" /> },
                  { label: "Afternoon", data: getPeriodData(dailyData[activeDayIndex].hours, 12, 17), icon: <WiDaySunny size={36} color="#0ea5e9" /> },
                  { label: "Night", data: getPeriodData(dailyData[activeDayIndex].hours, 18, 23), icon: <WiNightClear size={36} color="#334155" /> },
                ].map((period, i) => (
                  period.data && (
                    <div key={i} style={{ flex: "1 1 120px", background: "#f8fafc", borderRadius: "12px", padding: "16px", border: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <Text style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>{period.label}</Text>
                        {period.icon}
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "12px" }}>
                        <Text style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>{period.data.temp}°</Text>
                        {getWeatherIcon(period.data.pseudoHour, 24, "#0284c7")}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <WiRaindrops size={16} color="#64748b" />
                          <Text style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>{period.data.precip}mm</Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <WiStrongWind size={16} color="#64748b" />
                          <Text style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>{period.data.wind}km/h</Text>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Trekker Advisory */}
            <div
              style={{
                flex: "1 1 300px",
                background: "#ffffff",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Title level={5} style={{ margin: 0, color: "#0f172a" }}>Trekker's Advisory</Title>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                {(() => {
                  const advisoryInfo = getTrekkerAdvisory(dailyData[activeDayIndex]);
                  const colors = {
                    success: { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", icon: <FaCheckCircle color="#22c55e" /> },
                    warning: { bg: "#fefce8", border: "#fef08a", text: "#854d0e", icon: <FaExclamationTriangle color="#eab308" /> },
                    error: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", icon: <FaInfoCircle color="#ef4444" /> }
                  };
                  const style = colors[advisoryInfo.severity];

                  return advisoryInfo.advisories.map((adv, i) => (
                    <div key={i} style={{
                      background: style.bg,
                      border: `1px solid ${style.border}`,
                      padding: "16px",
                      borderRadius: "12px",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start"
                    }}>
                      <div style={{ marginTop: "2px" }}>{style.icon}</div>
                      <Text style={{ color: style.text, fontWeight: 500, fontSize: "14px", lineHeight: "1.5" }}>
                        {adv}
                      </Text>
                    </div>
                  ));
                })()}
              </div>

              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px dashed #e2e8f0" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <Text style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Nighttime Low</Text>
                   <Text style={{ fontSize: "14px", color: "#0f172a", fontWeight: 800 }}>{dailyData[activeDayIndex].minTemp}°C</Text>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                   <Text style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Daytime High</Text>
                   <Text style={{ fontSize: "14px", color: "#0f172a", fontWeight: 800 }}>{dailyData[activeDayIndex].maxTemp}°C</Text>
                 </div>
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
          background: rgba(2, 132, 199, 0.3);
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
