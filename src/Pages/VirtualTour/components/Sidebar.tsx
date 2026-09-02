import React from 'react';
import { Typography, Button, Space } from 'antd';
import { PlayCircleOutlined, CompassOutlined, FieldTimeOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Trek } from '@/Pages/VirtualTour/types';

const { Title, Text } = Typography;

interface SidebarProps {
  trek: Trek;
  activeIndex: number;
  onSelectDestination: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ trek, activeIndex, onSelectDestination }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="vt-sidebar-header">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12 }}>
            <CompassOutlined style={{ marginRight: 6 }} /> {trek.region}
          </Text>
          <Title level={4} style={{ margin: 0, color: 'white' }}>{trek.name}</Title>
          <Button type="primary" icon={<PlayCircleOutlined />} block style={{ marginTop: 16 }}>
            Start Virtual Tour
          </Button>
        </Space>
      </div>

      <div className="vt-sidebar-menu">
        <Title level={5} style={{ color: '#888', fontSize: 12, marginBottom: 16, marginTop: 8 }}>
          ROUTE DETAILS
        </Title>
        
        {trek.destinations.map((dest, index) => (
          <div 
            key={dest.slug}
            className={`vt-route-item ${index === activeIndex ? 'active' : ''}`}
            onClick={() => onSelectDestination(index)}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={{ fontSize: 10, color: index === activeIndex ? '#1677ff' : '#888' }}>
                DAY {dest.dayNumber}
              </Text>
              <Text strong style={{ color: index === activeIndex ? 'white' : '#ccc', fontSize: 15 }}>
                {dest.name}
              </Text>
              
              <Space size="middle" style={{ marginTop: 6 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <EnvironmentOutlined /> {dest.altitude}m / {dest.altitudeFt}ft
                </Text>
                {dest.travelTimeFromPrevious !== null && dest.travelTimeFromPrevious > 0 && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <FieldTimeOutlined /> {dest.travelTimeFromPrevious} Hrs
                  </Text>
                )}
              </Space>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
