import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ElevationChartProps {
  data: {
    name: string;
    altitude: number;
    travelTimeToNext?: number | string | null;
    hasMultipleNextDestination?: boolean;
    multipleDestinationRouteTime?: {
      timeToTravel?: number | string | null;
      toTrailDestination?: {
        name?: string | null;
      } | null;
    }[];
    routeTimes?: {
      timeToTravel?: number | string | null;
      toTrailDestination?: {
        name?: string | null;
      } | null;
    }[];
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const point = payload[0]?.payload || {};
    const multipleRouteTimes =
      point?.hasMultipleNextDestination
        ? Array.isArray(point?.multipleDestinationRouteTime) &&
          point.multipleDestinationRouteTime.length > 0
          ? point.multipleDestinationRouteTime
          : Array.isArray(point?.routeTimes)
            ? point.routeTimes
            : []
        : [];
    const shouldShowSingleTravelTime =
      multipleRouteTimes.length === 0 &&
      point?.travelTimeToNext !== null &&
      point?.travelTimeToNext !== undefined &&
      point?.travelTimeToNext !== "";

    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
        <p style={{ margin: 0, color: "#2ecc71" }}>
          Altitude: {payload[0].value}m
        </p>
        {multipleRouteTimes.length > 0
          ? multipleRouteTimes.map((rt: any, index: number) => (
              <p
                key={`${rt?._id || index}`}
                style={{ margin: 0, color: "#3498db" }}
              >
                Travel Time to {rt?.toTrailDestination?.name || "next"}:{" "}
                {rt?.timeToTravel} hrs
              </p>
            ))
          : shouldShowSingleTravelTime && (
              <p style={{ margin: 0, color: "#3498db" }}>
                Travel Time to Next: {point.travelTimeToNext} hrs
              </p>
            )}
      </div>
    );
  }
  return null;
};

const ElevationChart: React.FC<ElevationChartProps> = ({ data }) => {
  return (
    <div style={{ width: "100%", height: "350px", overflowX: "auto" }}>
      <div style={{ width: 700, minWidth: "100%", height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorElev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2ecc71" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eee"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: "Altitude (m)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#666" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="altitude"
              stroke="#2ecc71"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorElev)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ElevationChart;
