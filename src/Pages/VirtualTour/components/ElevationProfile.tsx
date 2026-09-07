import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Destination } from '@/Pages/VirtualTour/types';

interface ElevationProfileProps {
  destinations: Destination[];
  activeIndex: number;
}

const ElevationProfile: React.FC<ElevationProfileProps> = ({ destinations, activeIndex }) => {
  const data = destinations.map((dest, index) => ({
    name: dest.name,
    altitude: dest.altitude,
    index,
  }));

  const activeDestination = destinations[activeIndex];

  return (
    <div style={{ width: '100%', height: 220, paddingTop: 16, paddingBottom: 16 }}>
      <h4 style={{ color: '#888', fontSize: 12, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
        Elevation Profile
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAltitude" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1677ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#888', fontSize: 10 }} 
            axisLine={false} 
            tickLine={false} 
            interval="preserveStartEnd" 
            minTickGap={10}
          />
          <YAxis 
            tick={{ fill: '#888', fontSize: 10 }} 
            axisLine={false} 
            tickLine={false} 
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: 4 }}
            itemStyle={{ color: '#fff', fontSize: 12 }}
            labelStyle={{ color: '#888', marginBottom: 4, fontSize: 12 }}
            formatter={(value: any) => [`${value}m`, 'Altitude']}
          />
          <Area 
            type="monotone" 
            dataKey="altitude" 
            stroke="#1677ff" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorAltitude)" 
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              return (
                <circle key={`dot-${payload.index}`} cx={cx} cy={cy} r={2} fill="#1677ff" />
              );
            }}
          />
          {activeDestination && (
            <ReferenceDot 
              x={activeDestination.name} 
              y={activeDestination.altitude}
              shape={(props: any) => {
                const { cx, cy } = props;
                return (
                  <g 
                    style={{ 
                      transition: 'transform 0.4s ease-in-out',
                      transform: `translate(${cx}px, ${cy}px)`
                    }}
                  >
                    <circle r="6" fill="#faad14">
                      <animate attributeName="r" values="4; 12; 4" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8; 0; 0.8" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle r="4" fill="#faad14" />
                    <text 
                      y={22} 
                      textAnchor="middle" 
                      fill="#faad14" 
                      fontSize="11" 
                      fontWeight="600"
                      style={{ textShadow: '0px 1px 4px rgba(0,0,0,0.8)' }}
                    >
                      {activeDestination.name}
                    </text>
                  </g>
                );
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ElevationProfile;

